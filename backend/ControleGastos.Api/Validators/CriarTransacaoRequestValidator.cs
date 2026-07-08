using ControleGastos.Api.DTOs;
using FluentValidation;

namespace ControleGastos.Api.Validators;

// Apenas validação de formato. Regras de negócio (ex.: menor de idade só
// pode registrar despesa, pessoa precisa existir) ficam nos services.
public class CriarTransacaoRequestValidator : AbstractValidator<CriarTransacaoRequest>
{
    public CriarTransacaoRequestValidator()
    {
        RuleFor(x => x.PessoaId)
            .GreaterThan(0);

        RuleFor(x => x.Descricao)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Valor)
            .GreaterThan(0);

        RuleFor(x => x.Tipo)
            .IsInEnum();
    }
}
