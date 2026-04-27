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
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public ProductsController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    // GET /api/products - 列表（游客可看）
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? brand = null,
        [FromQuery] string? search = null,
        [FromQuery] string? tag = null,
        [FromQuery] string? industry = null,
        [FromQuery] string? sport = null,
        [FromQuery] string? sort = null, // price-asc | price-desc | newest
        [FromQuery] string? status = null
    )
    {
        var query = _db.Products
            .Where(p => p.Visibility == "visible" && p.Status == "active");

        if (!string.IsNullOrEmpty(brand))
            query = query.Where(p => p.Brand == brand);

        if (!string.IsNullOrEmpty(tag))
            query = query.Where(p => p.Tags.Contains(tag));

        if (!string.IsNullOrEmpty(industry))
            query = query.Where(p => p.Industries.Contains(industry));

        if (!string.IsNullOrEmpty(sport))
            query = query.Where(p => p.Sports.Contains(sport));

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p =>
                p.Sku.Contains(search) ||
                p.NameZh.Contains(search) ||
                p.NameEn.Contains(search) ||
                p.ShortDescZh!.Contains(search) ||
                p.ShortDescEn!.Contains(search)
            );

        // Sorting
        query = (sort?.ToLower()) switch
        {
            "price-asc" => query.OrderBy(p => p.PriceUsd),
            "price-desc" => query.OrderByDescending(p => p.PriceUsd),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new ProductListDto(
            total, page, pageSize,
            items.Select(ToDto).ToList()
        ));
    }

    // GET /api/products/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();
        if (product.Visibility == "trash" && !IsAdmin()) return NotFound();
        return Ok(ToDto(product));
    }

    // GET /api/products/sku/{sku}
    [HttpGet("sku/{sku}")]
    public async Task<IActionResult> GetBySku(string sku)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Sku.ToLower() == sku.ToLower());
        if (product == null) return NotFound();
        return Ok(ToDto(product));
    }

    // ============ Admin Only ============

    // POST /api/products (Admin: Create)
    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductCreateDto dto)
    {
        if (await _db.Products.AnyAsync(p => p.Sku == dto.Sku))
            return BadRequest(new { error = "SKU already exists" });

        var userId = GetUserId();
        var product = new Product
        {
            Sku = dto.Sku,
            NameZh = dto.NameZh,
            NameEn = dto.NameEn,
            ShortDescZh = dto.ShortDescZh,
            ShortDescEn = dto.ShortDescEn,
            DescriptionZh = dto.DescriptionZh,
            DescriptionEn = dto.DescriptionEn,
            Brand = dto.Brand,
            Tags = dto.Tags,
            Industries = dto.Industries,
            Sports = dto.Sports,
            Certifications = dto.Certifications,
            PriceUsd = dto.PriceUsd,
            Moq = dto.Moq,
            LeadTimeDays = dto.LeadTimeDays,
            Images = "[]",
            VideoUrl = dto.VideoUrl,
            Specs = dto.Specs,
            Status = dto.Status,
            Visibility = "visible",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CreatedBy = userId
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, ToDto(product));
    }

    // PUT /api/products/{id} (Admin: Update)
    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDto dto)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();

        var userId = GetUserId();

        if (dto.NameZh != null) product.NameZh = dto.NameZh;
        if (dto.NameEn != null) product.NameEn = dto.NameEn;
        if (dto.ShortDescZh != null) product.ShortDescZh = dto.ShortDescZh;
        if (dto.ShortDescEn != null) product.ShortDescEn = dto.ShortDescEn;
        if (dto.DescriptionZh != null) product.DescriptionZh = dto.DescriptionZh;
        if (dto.DescriptionEn != null) product.DescriptionEn = dto.DescriptionEn;
        if (dto.Tags != null) product.Tags = dto.Tags;
        if (dto.Industries != null) product.Industries = dto.Industries;
        if (dto.Sports != null) product.Sports = dto.Sports;
        if (dto.Certifications != null) product.Certifications = dto.Certifications;
        if (dto.PriceUsd.HasValue) product.PriceUsd = dto.PriceUsd.Value;
        if (dto.Moq.HasValue) product.Moq = dto.Moq.Value;
        if (dto.LeadTimeDays.HasValue) product.LeadTimeDays = dto.LeadTimeDays.Value;
        if (dto.VideoUrl != null) product.VideoUrl = dto.VideoUrl;
        if (dto.Specs != null) product.Specs = dto.Specs;
        if (dto.Status != null) product.Status = dto.Status;
        if (dto.Visibility != null) product.Visibility = dto.Visibility;
        if (dto.MetaTitle != null) product.MetaTitle = dto.MetaTitle;
        if (dto.MetaDesc != null) product.MetaDesc = dto.MetaDesc;

        product.UpdatedAt = DateTime.UtcNow;
        product.UpdatedBy = userId;

        await _db.SaveChangesAsync();
        return Ok(ToDto(product));
    }

    // DELETE /api/products/{id} (Admin: Soft delete to trash)
    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();
        product.Visibility = "trash";
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Moved to trash" });
    }

    // POST /api/products/{id}/images - 上传图片
    [Authorize(Roles = "admin")]
    [HttpPost("{id}/images")]
    public async Task<IActionResult> UploadImages(int id, List<IFormFile> files)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();

        var uploadDir = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "products", id.ToString());
        Directory.CreateDirectory(uploadDir);

        var existingImages = string.IsNullOrEmpty(product.Images)
            ? new List<string>()
            : JsonSerializer.Deserialize<List<string>>(product.Images) ?? new();

        foreach (var file in files)
        {
            if (file.Length > 5 * 1024 * 1024) continue; // max 5MB
            var ext = Path.GetExtension(file.FileName).ToLower();
            if (!new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" }.Contains(ext)) continue;

            var fileName = $"{Guid.NewGuid()}{ext}";
            var path = Path.Combine(uploadDir, fileName);
            await using var fs = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(fs);

            existingImages.Add($"/uploads/products/{id}/{fileName}");
        }

        product.Images = JsonSerializer.Serialize(existingImages);
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { images = existingImages });
    }

    // GET /api/products/admin/all (Admin: 所有产品含草稿/回收站)
    [Authorize(Roles = "admin")]
    [HttpGet("admin/all")]
    public async Task<IActionResult> AdminAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? visibility = null, // visible | hidden | trash
        [FromQuery] string? status = null,
        [FromQuery] string? search = null,
        [FromQuery] string? brand = null
    )
    {
        var query = _db.Products.AsQueryable();

        if (!string.IsNullOrEmpty(visibility))
            query = query.Where(p => p.Visibility == visibility);
        else
            query = query.Where(p => p.Visibility != "trash");

        if (!string.IsNullOrEmpty(status))
            query = query.Where(p => p.Status == status);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p => p.Sku.Contains(search) || p.NameZh.Contains(search));

        if (!string.IsNullOrEmpty(brand))
            query = query.Where(p => p.Brand == brand);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(p => p.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new ProductListDto(total, page, pageSize, items.Select(ToDto).ToList()));
    }

    // DELETE /api/products/admin/permanent/{id} (Admin: 永久删除)
    [Authorize(Roles = "admin")]
    [HttpDelete("admin/permanent/{id}")]
    public async Task<IActionResult> PermanentDelete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();
        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Permanently deleted" });
    }

    // POST /api/products/admin/restore/{id} (Admin: 恢复)
    [Authorize(Roles = "admin")]
    [HttpPost("admin/restore/{id}")]
    public async Task<IActionResult> Restore(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();
        product.Visibility = "visible";
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(ToDto(product));
    }

    // Helpers
    private int GetUserId() =>
        int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    private bool IsAdmin() =>
        User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value == "admin";

    private static ProductDto ToDto(Product p)
    {
        var images = string.IsNullOrEmpty(p.Images)
            ? new List<string>()
            : JsonSerializer.Deserialize<List<string>>(p.Images) ?? new();

        object? specs = null;
        if (!string.IsNullOrEmpty(p.Specs))
        {
            try { specs = JsonSerializer.Deserialize<object>(p.Specs); }
            catch { specs = p.Specs; }
        }

        return new ProductDto(
            p.Id, p.Sku, p.NameZh, p.NameEn,
            p.ShortDescZh, p.ShortDescEn,
            p.DescriptionZh, p.DescriptionEn,
            p.Brand, p.Tags, p.Industries, p.Sports, p.Certifications,
            p.PriceUsd, p.Moq, p.LeadTimeDays,
            images, p.VideoUrl, specs,
            p.Status, p.Visibility,
            p.MetaTitle, p.MetaDesc,
            p.CreatedAt, p.UpdatedAt
        );
    }
}
