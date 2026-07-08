namespace ControleGastos.Api.Models;

public class Pessoa
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public int Idade { get; set; }

    // Usada pela regra de negócio que restringe menores de 18 anos a
    // registrar apenas despesas (ver ITransacaoService).
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}
