using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace serve.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Role { get; set; } = "customer"; // customer | admin

    [MaxLength(100)]
    public string? Company { get; set; }

    [MaxLength(50)]
    public string? Country { get; set; }

    [MaxLength(20)]
    public string? Phone { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastLoginAt { get; set; }

    public bool IsActive { get; set; } = true;

    // Relations
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<Inquiry> Inquiries { get; set; } = new List<Inquiry>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
