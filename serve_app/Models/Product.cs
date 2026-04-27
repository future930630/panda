using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace serve.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Sku { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string NameZh { get; set; } = string.Empty;

    [MaxLength(200)]
    public string NameEn { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? ShortDescZh { get; set; }

    [MaxLength(1000)]
    public string? ShortDescEn { get; set; }

    [MaxLength(5000)]
    public string? DescriptionZh { get; set; }

    [MaxLength(5000)]
    public string? DescriptionEn { get; set; }

    // Brand: panda-shield / panda-cut / panda-heat / etc.
    [MaxLength(50)]
    public string Brand { get; set; } = "panda-shield";

    // Category tags: cut5, heat500, chemical, etc.
    [MaxLength(200)]
    public string Tags { get; set; } = string.Empty; // comma-separated

    // Industries: manufacturing, construction, etc.
    [MaxLength(500)]
    public string Industries { get; set; } = string.Empty; // comma-separated

    // Sports: cycling, climbing, etc.
    [MaxLength(500)]
    public string Sports { get; set; } = string.Empty; // comma-separated

    // Certifications: EN388, ANSI A4, etc.
    [MaxLength(500)]
    public string Certifications { get; set; } = string.Empty; // comma-separated

    // Price (USD)
    public decimal PriceUsd { get; set; }

    // MOQ (Minimum Order Quantity)
    public int Moq { get; set; } = 50;

    // Lead time in days
    public int LeadTimeDays { get; set; } = 7;

    // Images (JSON array of URLs)
    public string Images { get; set; } = "[]"; // JSON array

    // Video URL
    [MaxLength(500)]
    public string? VideoUrl { get; set; }

    // Technical specs (JSON object)
    public string Specs { get; set; } = "{}"; // JSON object

    // Status: draft / active / archived / deleted
    [MaxLength(20)]
    public string Status { get; set; } = "active";

    // Status: visible / hidden / trash
    [MaxLength(20)]
    public string Visibility { get; set; } = "visible"; // visible | hidden | trash

    // SEO
    [MaxLength(200)]
    public string? MetaTitle { get; set; }

    [MaxLength(500)]
    public string? MetaDesc { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public int? CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
}
