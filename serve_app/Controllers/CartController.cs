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
[Authorize]
public class CartController : ControllerBase
{
    private readonly AppDbContext _db;

    public CartController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/cart
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var items = await _db.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.AddedAt)
            .ToListAsync();

        return Ok(items.Select(ToDto).ToList());
    }

    // POST /api/cart
    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddCartDto dto)
    {
        var userId = GetUserId();
        var product = await _db.Products.FindAsync(dto.ProductId);
        if (product == null || product.Visibility != "visible")
            return NotFound(new { error = "Product not found" });

        var existing = await _db.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == dto.ProductId);

        if (existing != null)
        {
            existing.Quantity += dto.Quantity;
            existing.Specs = dto.Specs;
        }
        else
        {
            _db.CartItems.Add(new CartItem
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                Specs = dto.Specs,
                AddedAt = DateTime.UtcNow
            });
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Added to cart" });
    }

    // PUT /api/cart/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCart(int id, [FromBody] UpdateCartDto dto)
    {
        var userId = GetUserId();
        var item = await _db.CartItems
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (item == null) return NotFound();

        item.Quantity = dto.Quantity;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Updated" });
    }

    // DELETE /api/cart/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveCart(int id)
    {
        var userId = GetUserId();
        var item = await _db.CartItems
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (item == null) return NotFound();

        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Removed" });
    }

    // DELETE /api/cart (Clear all)
    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        var items = await _db.CartItems.Where(c => c.UserId == userId).ToListAsync();
        _db.CartItems.RemoveRange(items);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Cart cleared" });
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private static CartItemDto ToDto(CartItem c)
    {
        List<string> images = new();
        if (!string.IsNullOrEmpty(c.Product?.Images))
        {
            try { images = JsonSerializer.Deserialize<List<string>>(c.Product.Images) ?? new(); }
            catch { }
        }

        object? specs = null;
        if (!string.IsNullOrEmpty(c.Specs))
        {
            try { specs = JsonSerializer.Deserialize<object>(c.Specs); }
            catch { specs = c.Specs; }
        }

        return new CartItemDto(
            c.Id, c.ProductId,
            c.Product?.Sku ?? "",
            c.Product?.NameZh ?? "",
            c.Product?.NameEn ?? "",
            c.Product?.PriceUsd ?? 0,
            c.Quantity,
            images,
            specs,
            c.AddedAt
        );
    }
}
