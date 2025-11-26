import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { GraduationCap, BarChart3, Users, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Users,
      title: "Carômetro Inteligente",
      description: "Avalie alunos rapidamente com fotos e critérios padronizados de desempenho e comportamento.",
    },
    {
      icon: GraduationCap,
      title: "Banco de Questões",
      description: "Crie, organize e reutilize questões com diferentes níveis de dificuldade e tags personalizadas.",
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description: "Acompanhe a evolução dos alunos com relatórios individuais e comparativos de turma.",
    },
  ];

  const benefits = [
    "Redução do tempo gasto em avaliações manuais",
    "Acompanhamento individualizado de cada aluno",
    "Histórico completo de desempenho e evolução",
    "Geração automática de simulados personalizados",
    "Correção automática de questões objetivas",
    "Exportação de relatórios em PDF e CSV",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Sistema Educacional</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setLocation("/login")}>
              Entrar
            </Button>
            <Button onClick={() => setLocation("/register")}>
              Criar Conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Sistema de Avaliação Educacional
            </h1>
            <p className="text-xl text-muted-foreground">
              Simplifique a gestão de avaliações, acompanhe o desempenho dos alunos e tome decisões pedagógicas baseadas em dados.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setLocation("/register")}>
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation("/login")}>
                Fazer Login
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="/hero-education.png"
              alt="Sistema Educacional"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Funcionalidades Principais</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ferramentas completas para professores, coordenadores e gestores educacionais.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/dashboard-analytics.png"
                alt="Dashboard Analytics"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Por que escolher nosso sistema?
              </h2>
              <p className="text-muted-foreground text-lg">
                Desenvolvido especialmente para atender as necessidades de escolas e professores do ensino fundamental e médio.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" onClick={() => setLocation("/register")}>
                Experimente Gratuitamente
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para transformar sua gestão educacional?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de educadores que já utilizam nosso sistema.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setLocation("/register")}
          >
            Criar Conta Gratuita
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Sistema de Avaliação Educacional. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
