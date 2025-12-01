import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportRoadmapToPDF = async (roadmapData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Title
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text(roadmapData.courseName, margin, yPosition);
  yPosition += 15;

  // Course details
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Duration: ${roadmapData.totalDays} days`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Skill Level: ${roadmapData.skillLevel}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Study Hours/Day: ${roadmapData.studyHours}`, margin, yPosition);
  yPosition += 15;

  // Roadmap content
  roadmapData.roadmap.forEach((day, dayIndex) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }

    // Day header
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Day ${day.day}${day.isRevisionDay ? ' (Revision)' : ''}`, margin, yPosition);
    yPosition += 10;

    // Topics
    day.topics.forEach((topic) => {
      if (yPosition > 260) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.text(`• ${topic.title}`, margin + 5, yPosition);
      yPosition += 6;

      pdf.setFont(undefined, 'normal');
      const description = pdf.splitTextToSize(topic.description, pageWidth - 2 * margin - 10);
      pdf.text(description, margin + 10, yPosition);
      yPosition += description.length * 4 + 3;

      pdf.text(`Duration: ${topic.duration} | Difficulty: ${topic.difficulty}`, margin + 10, yPosition);
      yPosition += 8;
    });

    yPosition += 5;
  });

  // Save the PDF
  pdf.save(`${roadmapData.courseName.replace(/\s+/g, '_')}_roadmap.pdf`);
};

export const exportProgressReport = async (progressData, roadmapData) => {
  const pdf = new jsPDF();
  const margin = 20;
  let yPosition = margin;

  // Title
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.text('Learning Progress Report', margin, yPosition);
  yPosition += 15;

  // Course info
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Course: ${roadmapData.courseName}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;

  // Progress stats
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Progress Statistics', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Completion: ${progressData.completionPercentage}%`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Topics Completed: ${progressData.completedTopics}/${progressData.totalTopics}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Days Completed: ${progressData.completedDays}/${roadmapData.totalDays}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Learning Streak: ${progressData.streak} days`, margin, yPosition);
  yPosition += 15;

  pdf.save(`${roadmapData.courseName.replace(/\s+/g, '_')}_progress_report.pdf`);
};