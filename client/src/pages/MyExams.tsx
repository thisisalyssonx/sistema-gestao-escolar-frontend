import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockExams, mockClasses } from "../lib/mockData";
import { Exam } from "../types";
import { Calendar, Clock, FileText, Play, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function MyExams() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Filter exams based on student's class (simulated)
    // In a real app, this would fetch from API based on user.classId
    const studentExams = mockExams.filter((exam) => {
      // Simulate that student belongs to class c1
      return exam.classId === "c1";
    });
    
    setExams(studentExams);
    setIsLoading(false);
  };

  const getExamStatus = (exam: Exam) => {
    const now = new Date();
    if (now < exam.startDate) {
      return { 
        label: "Agendado", 
        variant: "secondary" as const,
        icon: Calendar,
        color: "text-blue-600"
      };
    } else if (now > exam.endDate) {
      return { 
        label: "Encerrado", 
        variant: "outline" as const,
        icon: CheckCircle,
        color: "text-gray-600"
      };
    } else {
      return { 
        label: "Disponível", 
        variant: "default" as const,
        icon: AlertCircle,
        color: "text-green-600"
      };
    }
  };

  const handleStartExam = (exam: Exam) => {
    const status = getExamStatus(exam);
    
    if (status.label === "Encerrado") {
      toast.error("Esta prova já foi encerrada");
      return;
    }
    
    if (status.label === "Agendado") {
      toast.error("Esta prova ainda não está disponível");
      return;
    }
    
    toast.success("Iniciando prova... (funcionalidade de realização de prova em desenvolvimento)");
  };

  const getClassName = (classId: string) => {
    return mockClasses.find((c) => c.id === classId)?.name || "N/A";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return "Encerrado";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} dia${days > 1 ? "s" : ""} restante${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hora${hours > 1 ? "s" : ""} restante${hours > 1 ? "s" : ""}`;
    return "Menos de 1 hora";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando provas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Provas</h1>
          <p className="text-muted-foreground">
            Visualize e realize suas avaliações disponíveis
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Provas Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {exams.filter((e) => {
                  const now = new Date();
                  return now >= e.startDate && now <= e.endDate;
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Provas Agendadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {exams.filter((e) => new Date() < e.startDate).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Provas Realizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">
                {exams.filter((e) => new Date() > e.endDate).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exams List */}
        {exams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Nenhuma prova disponível</p>
              <p className="text-sm text-muted-foreground">
                Você não possui provas cadastradas no momento
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => {
              const status = getExamStatus(exam);
              const StatusIcon = status.icon;
              const isAvailable = status.label === "Disponível";
              
              return (
                <Card key={exam.id} className={`hover:shadow-md transition-shadow ${isAvailable ? "border-green-200" : ""}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{exam.title}</CardTitle>
                          <Badge variant={status.variant} className="flex items-center gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                        {exam.description && (
                          <CardDescription className="mt-2">{exam.description}</CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Exam Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{exam.questions.length} questões</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{exam.timeLimit} minutos</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(exam.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <span>{getTimeRemaining(exam.endDate)}</span>
                        </div>
                      </div>

                      {/* Progress (simulated) */}
                      {status.label === "Encerrado" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Nota obtida</span>
                            <span className="font-medium">8.5/10</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex gap-2 pt-2">
                        {isAvailable ? (
                          <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleStartExam(exam)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Iniciar Prova
                          </Button>
                        ) : status.label === "Encerrado" ? (
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => toast.info("Visualização de gabarito em desenvolvimento")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Ver Resultado
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            disabled
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Aguardando Início
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
