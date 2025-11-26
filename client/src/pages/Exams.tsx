import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { mockExams, mockClasses, mockQuestions } from "../lib/mockData";
import { Exam, Question } from "../types";
import { Plus, Calendar, Clock, Users, Edit, Trash2, FileText, Play } from "lucide-react";
import { toast } from "sonner";

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    timeLimit: 60,
    shuffleQuestions: true,
    shuffleOptions: true,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setExams(mockExams);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.classId || !formData.startDate || !formData.endDate) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (selectedQuestions.length === 0) {
      toast.error("Selecione pelo menos uma questão");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const questions = mockQuestions.filter((q) => selectedQuestions.includes(q.id));

    if (editingExam) {
      setExams((prev) =>
        prev.map((e) =>
          e.id === editingExam.id
            ? {
                ...e,
                ...formData,
                questions,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
              }
            : e
        )
      );
      toast.success("Simulado atualizado com sucesso!");
    } else {
      const newExam: Exam = {
        id: `e${Date.now()}`,
        ...formData,
        questions,
        createdById: "t1",
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        createdAt: new Date(),
      };
      setExams((prev) => [...prev, newExam]);
      toast.success("Simulado criado com sucesso!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description || "",
      classId: exam.classId,
      timeLimit: exam.timeLimit || 60,
      shuffleQuestions: exam.shuffleQuestions,
      shuffleOptions: exam.shuffleOptions,
      startDate: exam.startDate.toISOString().slice(0, 16),
      endDate: exam.endDate.toISOString().slice(0, 16),
    });
    setSelectedQuestions(exam.questions.map((q) => q.id));
    setIsDialogOpen(true);
  };

  const handleDelete = async (examId: string) => {
    if (!confirm("Tem certeza que deseja excluir este simulado?")) return;

    await new Promise((resolve) => setTimeout(resolve, 500));
    setExams((prev) => prev.filter((e) => e.id !== examId));
    toast.success("Simulado excluído com sucesso!");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      classId: "",
      timeLimit: 60,
      shuffleQuestions: true,
      shuffleOptions: true,
      startDate: "",
      endDate: "",
    });
    setSelectedQuestions([]);
    setEditingExam(null);
  };

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const getClassName = (classId: string) => {
    return mockClasses.find((c) => c.id === classId)?.name || "N/A";
  };

  const getExamStatus = (exam: Exam) => {
    const now = new Date();
    if (now < exam.startDate) {
      return { label: "Agendado", variant: "secondary" as const };
    } else if (now > exam.endDate) {
      return { label: "Encerrado", variant: "outline" as const };
    } else {
      return { label: "Em Andamento", variant: "default" as const };
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando simulados...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Simulados e Provas</h1>
            <p className="text-muted-foreground">
              Crie e gerencie avaliações para suas turmas
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Simulado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingExam ? "Editar Simulado" : "Novo Simulado"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure o simulado e selecione as questões
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Prova de Matemática - 1º Bimestre"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descrição opcional do simulado..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="classId">Turma *</Label>
                      <Select
                        value={formData.classId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, classId: value })
                        }
                      >
                        <SelectTrigger id="classId">
                          <SelectValue placeholder="Selecione a turma" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClasses.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeLimit">Tempo Limite (min)</Label>
                      <Input
                        id="timeLimit"
                        type="number"
                        value={formData.timeLimit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            timeLimit: parseInt(e.target.value),
                          })
                        }
                        min={1}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data de Início *</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data de Término *</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shuffleQuestions"
                        checked={formData.shuffleQuestions}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            shuffleQuestions: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="shuffleQuestions" className="font-normal">
                        Embaralhar questões
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shuffleOptions"
                        checked={formData.shuffleOptions}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            shuffleOptions: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="shuffleOptions" className="font-normal">
                        Embaralhar opções das questões
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Questões * ({selectedQuestions.length} selecionadas)</Label>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                      {mockQuestions.map((question) => (
                        <div
                          key={question.id}
                          className="flex items-start space-x-2 p-2 hover:bg-accent rounded"
                        >
                          <Checkbox
                            id={`q-${question.id}`}
                            checked={selectedQuestions.includes(question.id)}
                            onCheckedChange={() => toggleQuestion(question.id)}
                          />
                          <Label
                            htmlFor={`q-${question.id}`}
                            className="flex-1 font-normal cursor-pointer"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {question.subject}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {question.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm">{question.content}</p>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingExam ? "Atualizar" : "Criar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Exams List */}
        {exams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Nenhum simulado cadastrado</p>
              <p className="text-sm text-muted-foreground mb-4">
                Comece criando seu primeiro simulado
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Simulado
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {exams.map((exam) => {
              const status = getExamStatus(exam);
              return (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{exam.title}</CardTitle>
                        {exam.description && (
                          <CardDescription>{exam.description}</CardDescription>
                        )}
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{getClassName(exam.classId)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{exam.questions.length} questões</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{exam.timeLimit} minutos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {exam.startDate.toLocaleDateString("pt-BR")} -{" "}
                          {exam.endDate.toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(exam)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(exam.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
