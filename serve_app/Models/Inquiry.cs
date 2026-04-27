using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace serve.Models;

public class Inquiry
{
    public int Id { get; set; }

    public int UserId { get; set; }

    // Items: JSON array of {productId, sku, quantity, specs}
    [Required]
    public string Items { get; set; } = "[]";

    [MaxLength(5000)]
    public string? Message { get; set; }

    // Status: pending / replied / closed
    [MaxLength(20)]
    public string Status { get; set; } = "pending";

    // Reply from seller
    [MaxLength(5000)]
    public string? ReplyMessage { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? RepliedAt { get; set; }
    public int? RepliedBy { get; set; }

    // Contact info snapshot
    [MaxLength(100)]
    public string? ContactName { get; set; }

    [MaxLength(255)]
    public string? ContactEmail { get; set; }

    [MaxLength(50)]
    public string? ContactPhone { get; set; }

    [JsonIgnore]
    public User? User { get; set; }
}
