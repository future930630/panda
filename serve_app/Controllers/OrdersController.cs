using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using serve.Data;
using serve.DTOs;
using serve.Models;

namespace serve.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db)
    {
        _db = db;
    }

    // POST /api/orders - 创建订单
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var userId = GetUserId();

        // Resolve cart items to order items
        var cartItems = await _db.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
            return BadRequest(new { error = "Cart is empty" });

        var orderItems = cartItems.Select(ci => new
        {
            productId = ci.ProductId,
            sku = ci.Product?.Sku ?? "",
            nameZh = ci.Product?.NameZh ?? "",
            nameEn = ci.Product?.NameEn ?? "",
            unitPrice = ci.Product?.PriceUsd ?? 0,
            quantity = ci.Quantity,
            specs = ci.Specs,
            subtotal = (ci.Product?.PriceUsd ?? 0) * ci.Quantity
        }).ToList();

        var subtotal = orderItems.Sum(x => x.subtotal);
        var tax = subtotal * 0.1m; // 10% tax
        var shipping = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
        var total = subtotal + tax + shipping;

        var order = new Order
        {
            OrderNo = GenerateOrderNo(),
            UserId = userId,
            Items = JsonSerializer.Serialize(orderItems),
            Subtotal = subtotal,
            ShippingCost = shipping,
            Tax = tax,
            Total = total,
            Currency = "USD",
            Status = "pending",
            ShippingAddress = dto.ShippingAddress,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Orders.Add(order);

        // Keep cart items (don't clear) - user can reorder
        await _db.SaveChangesAsync();

        return Ok(ToDto(order));
    }

    // GET /api/orders - 客户查看订单
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetMyOrders(
        [FromQuery] string? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        var userId = GetUserId();
        var query = _db.Orders.Where(o => o.UserId == userId);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, page, pageSize, items = items.Select(ToDto).ToList() });
    }

    // GET /api/orders/{id}
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();
        if (order.UserId != userId && !IsAdmin())
            return Forbid();

        return Ok(ToDto(order));
    }

    // ============ Admin ============

    // GET /api/orders/admin/all
    [Authorize(Roles = "admin")]
    [HttpGet("admin/all")]
    public async Task<IActionResult> AdminAll(
        [FromQuery] string? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        var query = _db.Orders.Include(o => o.User).AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, page, pageSize, items = items.Select(ToDto).ToList() });
    }

    // PUT /api/orders/{id}/status - 更新状态
    [Authorize(Roles = "admin")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();

        order.Status = dto.Status;
        order.UpdatedAt = DateTime.UtcNow;

        if (dto.Status == "paid") order.PaidAt = DateTime.UtcNow;
        if (dto.Status == "shipped")
        {
            order.ShippedAt = DateTime.UtcNow;
            order.TrackingNo = dto.TrackingNo;
            order.Courier = dto.Courier;
        }
        if (dto.Status == "delivered") order.DeliveredAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(ToDto(order));
    }

    // PUT /api/orders/{id}/payment - 记录支付
    [Authorize]
    [HttpPut("{id}/payment")]
    public async Task<IActionResult> RecordPayment(int id, [FromBody] RecordPaymentDto dto)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();

        order.PaymentMethod = dto.Method;
        order.PaymentId = dto.PaymentId;
        order.Status = "paid";
        order.PaidAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(ToDto(order));
    }

    // GET /api/orders/reports/summary
    [Authorize(Roles = "admin")]
    [HttpGet("reports/summary")]
    public async Task<IActionResult> ReportSummary(
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null
    )
    {
        var query = _db.Orders.AsQueryable();
        if (from.HasValue) query = query.Where(o => o.CreatedAt >= from.Value);
        if (to.HasValue) query = query.Where(o => o.CreatedAt <= to.Value);

        var orders = await query.ToListAsync();

        var summary = new
        {
            totalOrders = orders.Count,
            totalRevenue = orders.Sum(o => o.Total),
            paidOrders = orders.Count(o => o.Status == "paid" || o.Status == "processing" || o.Status == "shipped" || o.Status == "delivered"),
            pendingOrders = orders.Count(o => o.Status == "pending"),
            shippedOrders = orders.Count(o => o.Status == "shipped" || o.Status == "delivered"),
            avgOrderValue = orders.Any() ? orders.Average(o => o.Total) : 0,
            topProducts = orders
                .SelectMany(o => JsonSerializer.Deserialize<List<dynamic>>(o.Items) ?? new List<dynamic>())
                .GroupBy(x => ((JsonElement)x).GetProperty("sku").GetString())
                .OrderByDescending(g => g.Count())
                .Take(5)
                .Select(g => new { sku = g.Key, count = g.Count() })
                .ToList()
        };

        return Ok(summary);
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private bool IsAdmin() =>
        User.FindFirst(ClaimTypes.Role)?.Value == "admin";

    private static string GenerateOrderNo()
    {
        var ts = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var rand = Random.Shared.Next(1000, 9999);
        return $"PS{ts}{rand}";
    }

    private static OrderDto ToDto(Order o) => new(
        o.Id, o.OrderNo, o.Items,
        o.Subtotal, o.ShippingCost, o.Tax, o.Total, o.Currency,
        o.Status, o.PaymentMethod, o.PaidAt,
        o.ShippingAddress, o.TrackingNo, o.Courier,
        o.ShippedAt, o.DeliveredAt, o.Notes, o.CreatedAt
    );
}

public record UpdateOrderStatusDto(
    string Status,
    string? TrackingNo,
    string? Courier
);

public record RecordPaymentDto(string Method, string PaymentId);
