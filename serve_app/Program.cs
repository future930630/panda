using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using serve.Data;
using serve.Models;

var builder = WebApplication.CreateBuilder(args);

// ============ Database (SQLite) ============
var dbPath = Path.Combine(builder.Environment.ContentRootPath, "pandashield.db");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// ============ JWT Authentication ============
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "PandaShieldSecretKey2026VeryLongAndSecure123!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "PandaShield";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "PandaShieldClient";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

// ============ CORS ============
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ============ Swagger ============
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PandaShield B2B API",
        Version = "v1",
        Description = "熊猫手护 B2B 电商平台 API"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ============ JSON Options ============
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition =
            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

var app = builder.Build();

// ============ Init Database ============
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    // Seed admin account if not exists
    if (!db.Users.Any(u => u.Role == "admin"))
    {
        db.Users.Add(new User
        {
            Username = "admin",
            Email = "admin@pandashield.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123!"),
            Role = "admin",
            Company = "PandaShield Inc.",
            Country = "China",
            Phone = "+86-000-0000-0000",
            CreatedAt = DateTime.UtcNow
        });
        db.SaveChanges();
        Console.WriteLine("✓ Admin account created: admin@pandashield.com / admin123!");
    }
    else
    {
        Console.WriteLine("✓ Database ready at: " + dbPath);
    }
}

// ============ Middleware ============
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "PandaShield API v1");
    c.RoutePrefix = "api-docs";
});

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// ============ Static Files (serves root HTML files) ============
var rootDir = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, ".."));
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(rootDir),
    RequestPath = ""
});

// ============ Routes ============
app.MapControllers();

// Root: redirect to index
app.MapGet("/", () => Results.Redirect("/index.html"));

// Health check
app.MapGet("/api/health", () => Results.Ok(new { status = "ok", time = DateTime.UtcNow }));

// File upload test
app.MapPost("/api/upload/test", async (IFormFile file) =>
{
    var path = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads", file.FileName);
    Directory.CreateDirectory(Path.GetDirectoryName(path)!);
    await using var fs = new FileStream(path, FileMode.Create);
    await file.CopyToAsync(fs);
    return Results.Ok(new { path = $"/uploads/{file.FileName}" });
});

Console.WriteLine("============================================");
Console.WriteLine("  PandaShield B2B API Server");
Console.WriteLine("  http://localhost:3000");
Console.WriteLine("  API Docs: http://localhost:3000/api-docs");
Console.WriteLine("  Admin: admin@pandashield.com / admin123!");
Console.WriteLine("============================================");

app.Run();
