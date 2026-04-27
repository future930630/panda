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
public class InquiriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public InquiriesController(AppDbContext db)
    {
        _db = db;
    }

    // POST /api/inquiries - 客户提交询盘（无需登录）
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInquiryDto dto)
    {
        var userId = GetUserIdOrNull();

        var user = userId.HasValue ? await _db.Users.FindAsync(userId.Value) : null;

        var inquiry = new Inquiry
        {
            UserId = userId ?? 0,
            Items = JsonSerializer.Serialize(dto.Items),
            Message = dto.Message,
            Status = "pending",
            CreatedAt = DateTime.UtcNow,
            ContactName = user?.Username,
            ContactEmail = user?.Email ?? dto.Items.FirstOrDefault()?.Specs,
            ContactPhone = user?.Phone
        };

        _db.Inquiries.Add(inquiry);
        await _db.SaveChangesAsync();

        // Clear cart if user is logged in
        if (userId.HasValue)
        {
            var cartItems = await _db.CartItems.Where(c => c.UserId == userId.Value).ToListAsync();
            _db.CartItems.RemoveRange(cartItems);
            await _db.SaveChangesAsync();
        }

        return Ok(new { message = "Inquiry submitted", id = inquiry.Id });
    }

    // GET /api/inquiries - 客户查看自己的询盘
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetMyInquiries()
    {
        var userId = GetUserId();
        var items = await _db.Inquiries
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
        return Ok(items.Select(ToDto).ToList());
    }

    // ============ Admin ============

    // GET /api/inquiries/admin/all - 管理员查看所有询盘
    [Authorize(Roles = "admin")]
    [HttpGet("admin/all")]
    public async Task<IActionResult> AdminAll(
        [FromQuery] string? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        var query = _db.Inquiries
            .Include(i => i.User)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(i => i.Status == status);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(i => i.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, page, pageSize, items = items.Select(ToDto).ToList() });
    }

    // PUT /api/inquiries/{id}/reply - 管理员回复询盘
    [Authorize(Roles = "admin")]
    [HttpPut("{id}/reply")]
    public async Task<IActionResult> Reply(int id, [FromBody] ReplyInquiryDto dto)
    {
        var inquiry = await _db.Inquiries.FindAsync(id);
        if (inquiry == null) return NotFound();

        inquiry.ReplyMessage = dto.Message;
        inquiry.Status = "replied";
        inquiry.RepliedAt = DateTime.UtcNow;
        inquiry.RepliedBy = GetUserId();

        await _db.SaveChangesAsync();
        return Ok(ToDto(inquiry));
    }

    // PUT /api/inquiries/{id}/close
    [Authorize(Roles = "admin")]
    [HttpPut("{id}/close")]
    public async Task<IActionResult> Close(int id)
    {
        var inquiry = await _db.Inquiries.FindAsync(id);
        if (inquiry == null) return NotFound();
        inquiry.Status = "closed";
        await _db.SaveChangesAsync();
        return Ok(ToDto(inquiry));
    }

    private int? GetUserIdOrNull()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : null;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private static InquiryDto ToDto(Inquiry i) => new(
        i.Id, i.Items, i.Message, i.Status,
        i.ReplyMessage, i.CreatedAt, i.RepliedAt,
        i.ContactName, i.ContactEmail, i.ContactPhone
    );
}

public record ReplyInquiryDto(string Message);
