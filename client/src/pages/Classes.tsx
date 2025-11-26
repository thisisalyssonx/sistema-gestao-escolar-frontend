import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { mockClasses, mockStudents } from "../lib/mockData";
import { Class } from "../types";
import { Plus, Users, Calendar, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Classes() {
  const [, setLocation] = useLocation();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setClasses(mockClasses);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.grade) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingClass) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === editingClass.id
            ? { ...c, ...formData, updatedAt: new Date() }
            : c
        )
      );
      toast.success("Turma atualizada com sucesso!");
    } else {
      const newClass: Class = {
        id: `c${Date.now()}`,
        ...formData,
        teacherId: "t1",
        studentIds: [],
        createdAt: new Date(),
      };
      setClasses((prev) => [...prev, newClass]);
      toast.success("Turma criada com sucesso!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      grade: classItem.grade,
      year: classItem.year,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (classId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta turma?")) return;

    await new Promise((resolve) => setTimeout(resolve, 500));
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    toast.success("Turma excluída com sucesso!");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      grade: "",
      year: new Date().getFullYear(),
    });
    setEditingClass(null);
  };

  const getStudentCount = (classId: string) => {
    return mockStudents.filter((s) => s.classId === classId).length;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando turmas...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
            <p className="text-muted-foreground">
              Gerencie as turmas da escola
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingClass ? "Editar Turma" : "Nova Turma"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingClass
                      ? "Atualize as informações da turma"
                      : "Preencha os dados para criar uma nova turma"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Turma *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: 9º Ano A"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Série/Ano *</Label>
                    <Input
                      id="grade"
                      placeholder="Ex: 9º Ano"
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Ano Letivo *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
                      }
                      required
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
                    {editingClass ? "Atualizar" : "Criar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Nenhuma turma cadastrada</p>
              <p className="text-sm text-muted-foreground mb-4">
                Comece criando sua primeira turma
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Turma
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{classItem.name}</CardTitle>
                      <CardDescription>{classItem.grade}</CardDescription>
                    </div>
                    <Badge variant="outline">
                      <Calendar className="mr-1 h-3 w-3" />
                      {classItem.year}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{getStudentCount(classItem.id)} alunos</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setLocation(`/students?class=${classItem.id}`)}
                      >
                        Ver Alunos
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(classItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(classItem.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
