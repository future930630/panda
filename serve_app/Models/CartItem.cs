using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace serve.Models;

public class CartItem
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; } = 1;

    // Custom specifications (color, size, etc.)
    [MaxLength(500)]
    public string? Specs { get; set; } // JSON: {"color":"orange","size":"L"}

    // Message / note
    [MaxLength(1000)]
    public string? Message { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [JsonIgnore]
    public User? User { get; set; }

    [JsonIgnore]
    public Product? Product { get; set; }
}
