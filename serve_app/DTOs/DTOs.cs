using System.ComponentModel.DataAnnotations;

namespace serve.DTOs;

// ============ Auth DTOs ============

public record RegisterDto(
    [Required][MaxLength(100)] string Username,
    [Required][EmailAddress][MaxLength(255)] string Email,
    [Required][MinLength(6)] string Password,
    [MaxLength(50)] string? Company,
    [MaxLength(50)] string? Country,
    [MaxLength(20)] string? Phone
);

public record LoginDto(
    [Required] string Email,
    [Required] string Password
);

public record AuthResponseDto(
    string Token,
    UserDto User
);

public record UserDto(
    int Id,
    string Username,
    string Email,
    string Role,
    string? Company,
    string? Country,
    string? Phone,
    DateTime CreatedAt
);

// ============ Product DTOs ============

public record ProductCreateDto(
    [Required][MaxLength(50)] string Sku,
    [Required][MaxLength(200)] string NameZh,
    [MaxLength(200)] string NameEn,
    [MaxLength(1000)] string? ShortDescZh,
    [MaxLength(1000)] string? ShortDescEn,
    [MaxLength(5000)] string? DescriptionZh,
    [MaxLength(5000)] string? DescriptionEn,
    [MaxLength(50)] string Brand,
    string Tags,
    string Industries,
    string Sports,
    string Certifications,
    decimal PriceUsd,
    int Moq,
    int LeadTimeDays,
    string? VideoUrl,
    string Specs,
    [MaxLength(20)] string Status
);

public record ProductUpdateDto(
    [MaxLength(200)] string? NameZh,
    [MaxLength(200)] string? NameEn,
    [MaxLength(1000)] string? ShortDescZh,
    [MaxLength(1000)] string? ShortDescEn,
    [MaxLength(5000)] string? DescriptionZh,
    [MaxLength(5000)] string? DescriptionEn,
    string? Tags,
    string? Industries,
    string? Sports,
    string? Certifications,
    decimal? PriceUsd,
    int? Moq,
    int? LeadTimeDays,
    string? VideoUrl,
    string? Specs,
    string? Status,
    string? Visibility,
    string? MetaTitle,
    string? MetaDesc
);

public record ProductDto(
    int Id,
    string Sku,
    string NameZh,
    string NameEn,
    string? ShortDescZh,
    string? ShortDescEn,
    string? DescriptionZh,
    string? DescriptionEn,
    string Brand,
    string Tags,
    string Industries,
    string Sports,
    string Certifications,
    decimal PriceUsd,
    int Moq,
    int LeadTimeDays,
    List<string> Images,
    string? VideoUrl,
    object? Specs,
    string Status,
    string Visibility,
    string? MetaTitle,
    string? MetaDesc,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record ProductListDto(
    int Total,
    int Page,
    int PageSize,
    List<ProductDto> Items
);

// ============ Cart DTOs ============

public record CartItemDto(
    int Id,
    int ProductId,
    string Sku,
    string NameZh,
    string NameEn,
    decimal UnitPrice,
    int Quantity,
    List<string> Images,
    object? Specs,
    DateTime AddedAt
);

public record AddCartDto(
    [Required] int ProductId,
    [Range(1, 9999)] int Quantity = 1,
    string? Specs = null
);

public record UpdateCartDto(
    [Range(1, 9999)] int Quantity
);

// ============ Inquiry DTOs ============

public record CreateInquiryDto(
    [Required] List<InquiryItemDto> Items,
    [MaxLength(5000)] string? Message
);

public record InquiryItemDto(
    int ProductId,
    int Quantity,
    string? Specs
);

public record InquiryDto(
    int Id,
    string Items,
    string? Message,
    string Status,
    string? ReplyMessage,
    DateTime CreatedAt,
    DateTime? RepliedAt,
    string? ContactName,
    string? ContactEmail,
    string? ContactPhone
);

// ============ Order DTOs ============

public record CreateOrderDto(
    [Required] List<OrderItemDto> Items,
    [MaxLength(200)] string? ShippingAddress,
    [MaxLength(2000)] string? Notes
);

public record OrderItemDto(
    int ProductId,
    int Quantity,
    string? Specs
);

public record OrderDto(
    int Id,
    string OrderNo,
    string Items,
    decimal Subtotal,
    decimal ShippingCost,
    decimal Tax,
    decimal Total,
    string Currency,
    string Status,
    string? PaymentMethod,
    DateTime? PaidAt,
    string? ShippingAddress,
    string? TrackingNo,
    string? Courier,
    DateTime? ShippedAt,
    DateTime? DeliveredAt,
    string? Notes,
    DateTime CreatedAt
);
