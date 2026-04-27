using Microsoft.EntityFrameworkCore;
using serve.Models;

namespace serve.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Inquiry> Inquiries => Set<Inquiry>();
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User indexes
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();

        // Product indexes
        modelBuilder.Entity<Product>().HasIndex(p => p.Sku).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(p => p.Brand);
        modelBuilder.Entity<Product>().HasIndex(p => p.Status);
        modelBuilder.Entity<Product>().HasIndex(p => p.Visibility);

        // CartItem indexes
        modelBuilder.Entity<CartItem>().HasIndex(c => new { c.UserId, c.ProductId }).IsUnique();

        // Order indexes
        modelBuilder.Entity<Order>().HasIndex(o => o.OrderNo).IsUnique();
        modelBuilder.Entity<Order>().HasIndex(o => o.UserId);

        // Inquiry indexes
        modelBuilder.Entity<Inquiry>().HasIndex(i => i.UserId);
        modelBuilder.Entity<Inquiry>().HasIndex(i => i.Status);
    }
}
