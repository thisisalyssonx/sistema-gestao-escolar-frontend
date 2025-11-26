import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { mockStudents, mockClasses, getStudentsByClass } from "../lib/mockData";
import { Student, CarometerAssessment } from "../types";
import { ASSESSMENT_CRITERIA } from "../const";
import { Save, Check, UserCircle } from "lucide-react";
import { toast } from "sonner";

export default function Carometer() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [assessments, setAssessments] = useState<Record<string, any>>({});
  const [currentAssessment, setCurrentAssessment] = useState({
    attendance: 3,
    participation: 3,
    responsibility: 3,
    sociability: 3,
    comments: "",
  });

  useEffect(() => {
    if (selectedClass) {
      const classStudents = getStudentsByClass(selectedClass);
      setStudents(classStudents);
      setSelectedStudent(null);
    }
  }, [selectedClass]);

  const handleSaveDraft = () => {
    if (!selectedStudent) {
      toast.error("Selecione um aluno primeiro");
      return;
    }

    setAssessments((prev) => ({
      ...prev,
      [selectedStudent.id]: {
        ...currentAssessment,
        status: "draft",
      },
    }));

    toast.success("Rascunho salvo com sucesso!");
  };

  const handleFinalize = () => {
    if (!selectedStudent) {
      toast.error("Selecione um aluno primeiro");
      return;
    }

    setAssessments((prev) => ({
      ...prev,
      [selectedStudent.id]: {
        ...currentAssessment,
        status: "finalized",
      },
    }));

    toast.success("Avaliação finalizada com sucesso!");
    
    // Move to next student
    const currentIndex = students.findIndex((s) => s.id === selectedStudent.id);
    if (currentIndex < students.length - 1) {
      const nextStudent = students[currentIndex + 1];
      setSelectedStudent(nextStudent);
      loadAssessment(nextStudent.id);
    }
  };

  const loadAssessment = (studentId: string) => {
    const existing = assessments[studentId];
    if (existing) {
      setCurrentAssessment(existing);
    } else {
      setCurrentAssessment({
        attendance: 3,
        participation: 3,
        responsibility: 3,
        sociability: 3,
        comments: "",
      });
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    loadAssessment(student.id);
  };

  const getCriteriaLabel = (value: number): string => {
    const labels = ["Muito Baixo", "Baixo", "Regular", "Bom", "Muito Bom", "Excelente"];
    return labels[value] || "Regular";
  };

  const getCriteriaColor = (value: number): string => {
    if (value <= 1) return "text-red-600";
    if (value <= 2) return "text-orange-600";
    if (value <= 3) return "text-yellow-600";
    if (value <= 4) return "text-green-600";
    return "text-blue-600";
  };

  const getAssessmentStatus = (studentId: string) => {
    const assessment = assessments[studentId];
    if (!assessment) return null;
    return assessment.status === "finalized" ? (
      <Badge variant="default" className="bg-green-600">
        <Check className="h-3 w-3 mr-1" />
        Finalizado
      </Badge>
    ) : (
      <Badge variant="secondary">Rascunho</Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carômetro</h1>
          <p className="text-muted-foreground">
            Avalie os alunos por critérios visuais e comportamentais
          </p>
        </div>

        {/* Class Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Turma</CardTitle>
            <CardDescription>
              Escolha a turma para iniciar as avaliações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                {mockClasses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Students Grid and Assessment */}
        {selectedClass && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Students List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Alunos</CardTitle>
                <CardDescription>
                  {students.length} alunos na turma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum aluno nesta turma
                    </p>
                  </div>
                ) : (
                  students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleStudentSelect(student)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedStudent?.id === student.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-accent"
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={student.photo} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        {student.nickname && (
                          <p className="text-xs text-muted-foreground">
                            "{student.nickname}"
                          </p>
                        )}
                      </div>
                      {getAssessmentStatus(student.id)}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Assessment Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Avaliação</CardTitle>
                <CardDescription>
                  {selectedStudent
                    ? `Avaliando ${selectedStudent.name}`
                    : "Selecione um aluno para começar"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedStudent ? (
                  <div className="space-y-6">
                    {/* Student Info */}
                    <div className="flex items-center gap-4 p-4 bg-accent rounded-lg">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={selectedStudent.photo}
                          alt={selectedStudent.name}
                        />
                        <AvatarFallback>
                          {selectedStudent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {selectedStudent.name}
                        </h3>
                        {selectedStudent.nickname && (
                          <p className="text-muted-foreground">
                            "{selectedStudent.nickname}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Criteria Sliders */}
                    <div className="space-y-6">
                      {/* Attendance */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Assiduidade</Label>
                          <span
                            className={`text-sm font-medium ${getCriteriaColor(
                              currentAssessment.attendance
                            )}`}
                          >
                            {getCriteriaLabel(currentAssessment.attendance)}
                          </span>
                        </div>
                        <Slider
                          value={[currentAssessment.attendance]}
                          onValueChange={([value]) =>
                            setCurrentAssessment({
                              ...currentAssessment,
                              attendance: value,
                            })
                          }
                          min={0}
                          max={5}
                          step={1}
                        />
                      </div>

                      {/* Participation */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Participação</Label>
                          <span
                            className={`text-sm font-medium ${getCriteriaColor(
                              currentAssessment.participation
                            )}`}
                          >
                            {getCriteriaLabel(currentAssessment.participation)}
                          </span>
                        </div>
                        <Slider
                          value={[currentAssessment.participation]}
                          onValueChange={([value]) =>
                            setCurrentAssessment({
                              ...currentAssessment,
                              participation: value,
                            })
                          }
                          min={0}
                          max={5}
                          step={1}
                        />
                      </div>

                      {/* Responsibility */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Responsabilidade</Label>
                          <span
                            className={`text-sm font-medium ${getCriteriaColor(
                              currentAssessment.responsibility
                            )}`}
                          >
                            {getCriteriaLabel(currentAssessment.responsibility)}
                          </span>
                        </div>
                        <Slider
                          value={[currentAssessment.responsibility]}
                          onValueChange={([value]) =>
                            setCurrentAssessment({
                              ...currentAssessment,
                              responsibility: value,
                            })
                          }
                          min={0}
                          max={5}
                          step={1}
                        />
                      </div>

                      {/* Sociability */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Sociabilidade</Label>
                          <span
                            className={`text-sm font-medium ${getCriteriaColor(
                              currentAssessment.sociability
                            )}`}
                          >
                            {getCriteriaLabel(currentAssessment.sociability)}
                          </span>
                        </div>
                        <Slider
                          value={[currentAssessment.sociability]}
                          onValueChange={([value]) =>
                            setCurrentAssessment({
                              ...currentAssessment,
                              sociability: value,
                            })
                          }
                          min={0}
                          max={5}
                          step={1}
                        />
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                      <Label>Comentários</Label>
                      <Textarea
                        placeholder="Adicione observações sobre o aluno..."
                        value={currentAssessment.comments}
                        onChange={(e) =>
                          setCurrentAssessment({
                            ...currentAssessment,
                            comments: e.target.value,
                          })
                        }
                        rows={4}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleSaveDraft}
                        className="flex-1"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Rascunho
                      </Button>
                      <Button onClick={handleFinalize} className="flex-1">
                        <Check className="mr-2 h-4 w-4" />
                        Finalizar Avaliação
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Selecione um aluno
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Escolha um aluno da lista ao lado para começar a avaliação
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
