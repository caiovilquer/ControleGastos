using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();

    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pessoa>(entity =>
        {
            entity.Property(p => p.Nome)
                .IsRequired()
                .HasMaxLength(100);
        });

        modelBuilder.Entity<Transacao>(entity =>
        {
            entity.Property(t => t.Descricao)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(t => t.Valor)
                .HasPrecision(18, 2);

            // Deletar pessoa apaga as transações vinculadas.
            entity.HasOne(t => t.Pessoa)
                .WithMany(p => p.Transacoes)
                .HasForeignKey(t => t.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
