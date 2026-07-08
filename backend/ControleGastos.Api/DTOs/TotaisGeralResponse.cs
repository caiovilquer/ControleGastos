namespace ControleGastos.Api.DTOs;

public class TotaisGeralResponse
{
    public IReadOnlyCollection<TotaisPessoaResponse> Pessoas { get; set; } = Array.Empty<TotaisPessoaResponse>();

    public decimal TotalReceitas { get; set; }

    public decimal TotalDespesas { get; set; }

    public decimal Saldo { get; set; }
}
