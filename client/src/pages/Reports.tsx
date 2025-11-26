import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockStudents, mockClasses, mockPerformanceReports, getPerformanceReport } from "../lib/mockData";
import { PerformanceReport } from "../types";
import { Download, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { USER_ROLES } from "../const";

export default function Reports() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedStudent) {
      loadReport();
    }
  }, [selectedStudent]);

  const loadReport = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const studentReport = getPerformanceReport(selectedStudent);
    setReport(studentReport || null);
    setIsLoading(false);
  };

  const handleExportPDF = () => {
    toast.success("Relatório exportado com sucesso! (funcionalidade simulada)");
  };

  const handleExportCSV = () => {
    toast.success("Dados exportados para CSV! (funcionalidade simulada)");
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "declining":
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case "improving":
        return "Em Melhoria";
      case "declining":
        return "Em Declínio";
      default:
        return "Estável";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "bg-green-100 text-green-800";
      case "declining":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getCriteriaLabel = (key: string) => {
    const labels: Record<string, string> = {
      attendance: "Assiduidade",
      participation: "Participação",
      responsibility: "Responsabilidade",
      sociability: "Sociabilidade",
    };
    return labels[key] || key;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredStudents = selectedClass
    ? mockStudents.filter((s) => s.classId === selectedClass)
    : mockStudents;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios de Desempenho</h1>
            <p className="text-muted-foreground">
              Visualize e exporte relatórios de desempenho dos alunos
            </p>
          </div>
          {report && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Aluno</CardTitle>
            <CardDescription>
              Escolha a turma e o aluno para visualizar o relatório
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as turmas</SelectItem>
                    {mockClasses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select
                  value={selectedStudent}
                  onValueChange={setSelectedStudent}
                  disabled={!selectedClass}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando relatório...</p>
            </div>
          </div>
        ) : report ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Média Geral
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getScoreColor(report.averageScore)}`}>
                    {report.averageScore.toFixed(1)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Frequência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{report.attendance}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Provas Realizadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{report.exams.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tendência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(report.trend)}
                    <Badge className={getTrendColor(report.trend)}>
                      {getTrendLabel(report.trend)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Carometer Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliação Carômetro</CardTitle>
                <CardDescription>
                  Critérios comportamentais e de desempenho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(report.carometer).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{getCriteriaLabel(key)}</span>
                        <span className="text-sm text-muted-foreground">
                          {value}/5
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(value / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exam History */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Provas</CardTitle>
                <CardDescription>
                  Desempenho nas últimas avaliações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.exams.map((exam, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Prova #{index + 1}</p>
                          <p className="text-sm text-muted-foreground">
                            {exam.date.toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(exam.score)}`}>
                        {exam.score.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Period Info */}
            <Card>
              <CardHeader>
                <CardTitle>Período do Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {report.period.start.toLocaleDateString("pt-BR")} até{" "}
                  {report.period.end.toLocaleDateString("pt-BR")}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : selectedStudent ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Relatório não disponível</p>
              <p className="text-sm text-muted-foreground">
                Não há dados suficientes para gerar o relatório deste aluno
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Selecione um aluno</p>
              <p className="text-sm text-muted-foreground">
                Escolha uma turma e um aluno para visualizar o relatório de desempenho
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
