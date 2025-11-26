import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockQuestions } from "../lib/mockData";
import { Question } from "../types";
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from "../const";
import { Plus, Search, Edit, Trash2, BookOpen, X } from "lucide-react";
import { toast } from "sonner";

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [formData, setFormData] = useState<{
    type: typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];
    content: string;
    options: string[];
    correctAnswer: string;
    tags: string;
    difficulty: typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];
    subject: string;
  }>({
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    content: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    tags: "",
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    subject: "",
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, filterType, filterDifficulty]);

  const loadQuestions = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setQuestions(mockQuestions);
    setIsLoading(false);
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((q) => q.type === filterType);
    }

    if (filterDifficulty !== "all") {
      filtered = filtered.filter((q) => q.difficulty === filterDifficulty);
    }

    setFilteredQuestions(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content || !formData.subject) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      if (formData.options.some((opt) => !opt.trim())) {
        toast.error("Preencha todas as opções");
        return;
      }
      if (!formData.correctAnswer) {
        toast.error("Selecione a resposta correta");
        return;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const questionData = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      correctAnswer:
        formData.type === QUESTION_TYPES.MULTIPLE_CHOICE
          ? parseInt(formData.correctAnswer)
          : formData.correctAnswer,
    };

    if (editingQuestion) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestion.id
            ? { ...q, ...questionData, updatedAt: new Date() }
            : q
        )
      );
      toast.success("Questão atualizada com sucesso!");
    } else {
      const newQuestion: Question = {
        id: `q${Date.now()}`,
        ...questionData,
        createdById: "t1",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Question;
      setQuestions((prev) => [...prev, newQuestion]);
      toast.success("Questão criada com sucesso!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      type: question.type,
      content: question.content,
      options: question.options || ["", "", "", ""],
      correctAnswer:
        typeof question.correctAnswer === "number"
          ? question.correctAnswer.toString()
          : question.correctAnswer || "",
      tags: question.tags.join(", "),
      difficulty: question.difficulty,
      subject: question.subject,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta questão?")) return;

    await new Promise((resolve) => setTimeout(resolve, 500));
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    toast.success("Questão excluída com sucesso!");
  };

  const resetForm = () => {
    setFormData({
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      content: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      tags: "",
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      subject: "",
    });
    setEditingQuestion(null);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case DIFFICULTY_LEVELS.EASY:
        return "bg-green-100 text-green-800";
      case DIFFICULTY_LEVELS.MEDIUM:
        return "bg-yellow-100 text-yellow-800";
      case DIFFICULTY_LEVELS.HARD:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case DIFFICULTY_LEVELS.EASY:
        return "Fácil";
      case DIFFICULTY_LEVELS.MEDIUM:
        return "Médio";
      case DIFFICULTY_LEVELS.HARD:
        return "Difícil";
      default:
        return difficulty;
    }
  };

  const getTypeLabel = (type: string) => {
    return type === QUESTION_TYPES.MULTIPLE_CHOICE ? "Múltipla Escolha" : "Dissertativa";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando questões...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Banco de Questões</h1>
            <p className="text-muted-foreground">
              Gerencie questões para provas e simulados
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Questão
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestion ? "Editar Questão" : "Nova Questão"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados da questão
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value as any })
                        }
                      >
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={QUESTION_TYPES.MULTIPLE_CHOICE}>
                            Múltipla Escolha
                          </SelectItem>
                          <SelectItem value={QUESTION_TYPES.ESSAY}>
                            Dissertativa
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Dificuldade *</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) =>
                          setFormData({ ...formData, difficulty: value as any })
                        }
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DIFFICULTY_LEVELS.EASY}>Fácil</SelectItem>
                          <SelectItem value={DIFFICULTY_LEVELS.MEDIUM}>Médio</SelectItem>
                          <SelectItem value={DIFFICULTY_LEVELS.HARD}>Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Disciplina *</Label>
                    <Input
                      id="subject"
                      placeholder="Ex: Matemática"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Enunciado *</Label>
                    <Textarea
                      id="content"
                      placeholder="Digite o enunciado da questão..."
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={4}
                      required
                    />
                  </div>

                  {formData.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                    <>
                      <div className="space-y-2">
                        <Label>Opções *</Label>
                        {formData.options.map((option, index) => (
                          <Input
                            key={index}
                            placeholder={`Opção ${index + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            required
                          />
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="correctAnswer">Resposta Correta *</Label>
                        <Select
                          value={formData.correctAnswer}
                          onValueChange={(value) =>
                            setFormData({ ...formData, correctAnswer: value })
                          }
                        >
                          <SelectTrigger id="correctAnswer">
                            <SelectValue placeholder="Selecione a resposta correta" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.options.map((option, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                Opção {index + 1}: {option || "(vazia)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {(formData.type as string) === QUESTION_TYPES.ESSAY && (
                    <div className="space-y-2">
                      <Label htmlFor="essayAnswer">Resposta Esperada</Label>
                      <Textarea
                        id="essayAnswer"
                        placeholder="Digite a resposta esperada (opcional)..."
                        value={formData.correctAnswer}
                        onChange={(e) =>
                          setFormData({ ...formData, correctAnswer: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Separe por vírgula: geometria, triângulos"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                    />
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
                    {editingQuestion ? "Atualizar" : "Criar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por conteúdo, disciplina ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value={QUESTION_TYPES.MULTIPLE_CHOICE}>
                Múltipla Escolha
              </SelectItem>
              <SelectItem value={QUESTION_TYPES.ESSAY}>Dissertativa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value={DIFFICULTY_LEVELS.EASY}>Fácil</SelectItem>
              <SelectItem value={DIFFICULTY_LEVELS.MEDIUM}>Médio</SelectItem>
              <SelectItem value={DIFFICULTY_LEVELS.HARD}>Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Nenhuma questão encontrada</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || filterType !== "all" || filterDifficulty !== "all"
                  ? "Tente ajustar os filtros"
                  : "Comece criando sua primeira questão"}
              </p>
              {!searchTerm && filterType === "all" && filterDifficulty === "all" && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Questão
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{getTypeLabel(question.type)}</Badge>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {getDifficultyLabel(question.difficulty)}
                        </Badge>
                        <Badge variant="secondary">{question.subject}</Badge>
                      </div>
                      <CardTitle className="text-lg">{question.content}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {question.type === QUESTION_TYPES.MULTIPLE_CHOICE &&
                    question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded border ${
                              index === question.correctAnswer
                                ? "bg-green-50 border-green-200"
                                : "bg-muted/30"
                            }`}
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + index)})
                            </span>
                            {option}
                            {index === question.correctAnswer && (
                              <Badge className="ml-2 bg-green-600">Correta</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  {question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {question.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
