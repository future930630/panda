using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace serve.Models;

public class Order
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string OrderNo { get; set; } = string.Empty;

    public int UserId { get; set; }

    // Items: JSON array of {productId, sku, name, quantity, unitPrice, subtotal}
    [Required]
    public string Items { get; set; } = "[]";

    // Totals
    public decimal Subtotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }

    // Currency
    [MaxLength(10)]
    public string Currency { get; set; } = "USD";

    // Status: pending / paid / processing / shipped / delivered / cancelled
    [MaxLength(20)]
    public string Status { get; set; } = "pending";

    // Payment
    [MaxLength(50)]
    public string? PaymentMethod { get; set; } // paypal / stripe / alipay

    [MaxLength(100)]
    public string? PaymentId { get; set; }

    public DateTime? PaidAt { get; set; }

    // Shipping
    [MaxLength(200)]
    public string? ShippingAddress { get; set; }

    [MaxLength(50)]
    public string? TrackingNo { get; set; }

    [MaxLength(50)]
    public string? Courier { get; set; } // DHL / FedEx / UPS / etc.

    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }

    // Notes
    [MaxLength(2000)]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public User? User { get; set; }
}
