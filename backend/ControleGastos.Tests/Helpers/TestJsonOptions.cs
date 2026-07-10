using System.Text.Json;
using System.Text.Json.Serialization;

namespace ControleGastos.Tests.Helpers;

// Opções alinhadas à API (enums como string: "Despesa"/"Receita").
public static class TestJsonOptions
{
    public static JsonSerializerOptions Instance { get; } = Create();

    private static JsonSerializerOptions Create()
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        options.Converters.Add(new JsonStringEnumConverter());
        return options;
    }
}
