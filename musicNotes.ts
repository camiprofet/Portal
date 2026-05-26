/* ============================================================
   musicNotes — Frequency to Musical Note Mapping
   Mapeo de frecuencias a notas musicales para visualización
   ============================================================ */

export interface MusicalNote {
  name: string;
  frequency: number;
  octave: number;
}

// Notas musicales desde C0 (16.35 Hz) hasta C8 (4186 Hz)
// Basado en la escala temperada de 12 tonos
const NOTES: MusicalNote[] = [
  // Octava 0
  { name: "C", frequency: 16.35, octave: 0 },
  { name: "D", frequency: 18.35, octave: 0 },
  { name: "E", frequency: 20.6, octave: 0 },
  { name: "F", frequency: 21.83, octave: 0 },
  { name: "G", frequency: 24.5, octave: 0 },
  { name: "A", frequency: 27.5, octave: 0 },
  { name: "B", frequency: 30.87, octave: 0 },
  // Octava 1
  { name: "C", frequency: 32.7, octave: 1 },
  { name: "D", frequency: 36.71, octave: 1 },
  { name: "E", frequency: 41.2, octave: 1 },
  { name: "F", frequency: 43.65, octave: 1 },
  { name: "G", frequency: 49, octave: 1 },
  { name: "A", frequency: 55, octave: 1 },
  { name: "B", frequency: 61.74, octave: 1 },
  // Octava 2
  { name: "C", frequency: 65.41, octave: 2 },
  { name: "D", frequency: 73.42, octave: 2 },
  { name: "E", frequency: 82.41, octave: 2 },
  { name: "F", frequency: 87.31, octave: 2 },
  { name: "G", frequency: 98, octave: 2 },
  { name: "A", frequency: 110, octave: 2 },
  { name: "B", frequency: 123.47, octave: 2 },
  // Octava 3
  { name: "C", frequency: 130.81, octave: 3 },
  { name: "D", frequency: 146.83, octave: 3 },
  { name: "E", frequency: 164.81, octave: 3 },
  { name: "F", frequency: 174.61, octave: 3 },
  { name: "G", frequency: 196, octave: 3 },
  { name: "A", frequency: 220, octave: 3 },
  { name: "B", frequency: 246.94, octave: 3 },
  // Octava 4 (La4 = 440 Hz - estándar de afinación)
  { name: "C", frequency: 261.63, octave: 4 },
  { name: "D", frequency: 293.66, octave: 4 },
  { name: "E", frequency: 329.63, octave: 4 },
  { name: "F", frequency: 349.23, octave: 4 },
  { name: "G", frequency: 392, octave: 4 },
  { name: "A", frequency: 440, octave: 4 },
  { name: "B", frequency: 493.88, octave: 4 },
  // Octava 5
  { name: "C", frequency: 523.25, octave: 5 },
  { name: "D", frequency: 587.33, octave: 5 },
  { name: "E", frequency: 659.25, octave: 5 },
  { name: "F", frequency: 698.46, octave: 5 },
  { name: "G", frequency: 783.99, octave: 5 },
  { name: "A", frequency: 880, octave: 5 },
  { name: "B", frequency: 987.77, octave: 5 },
  // Octava 6
  { name: "C", frequency: 1046.5, octave: 6 },
  { name: "D", frequency: 1174.66, octave: 6 },
  { name: "E", frequency: 1318.51, octave: 6 },
  { name: "F", frequency: 1396.91, octave: 6 },
  { name: "G", frequency: 1567.98, octave: 6 },
  { name: "A", frequency: 1760, octave: 6 },
  { name: "B", frequency: 1975.53, octave: 6 },
  // Octava 7
  { name: "C", frequency: 2093, octave: 7 },
  { name: "D", frequency: 2349.32, octave: 7 },
  { name: "E", frequency: 2637.02, octave: 7 },
  { name: "F", frequency: 2793.83, octave: 7 },
  { name: "G", frequency: 3135.96, octave: 7 },
  { name: "A", frequency: 3520, octave: 7 },
  { name: "B", frequency: 3951.07, octave: 7 },
  // Octava 8
  { name: "C", frequency: 4186.01, octave: 8 },
];

/**
 * Obtiene las notas musicales que se deben mostrar en un rango de frecuencias
 * @param minFreq Frecuencia mínima (Hz)
 * @param maxFreq Frecuencia máxima (Hz)
 * @param maxLabels Número máximo de etiquetas a mostrar
 * @returns Array de notas musicales seleccionadas
 */
export function getMusicalNotesInRange(
  minFreq: number,
  maxFreq: number,
  maxLabels: number = 12
): MusicalNote[] {
  const notesInRange = NOTES.filter(
    (note) => note.frequency >= minFreq && note.frequency <= maxFreq
  );

  // Si hay demasiadas notas, seleccionar cada N-ésima
  if (notesInRange.length > maxLabels) {
    const step = Math.ceil(notesInRange.length / maxLabels);
    return notesInRange.filter((_, index) => index % step === 0);
  }

  return notesInRange;
}

/**
 * Obtiene la nota musical más cercana a una frecuencia dada
 * @param frequency Frecuencia en Hz
 * @returns Nota musical más cercana
 */
export function getNearestNote(frequency: number): MusicalNote {
  let nearest = NOTES[0];
  let minDiff = Math.abs(NOTES[0].frequency - frequency);

  for (const note of NOTES) {
    const diff = Math.abs(note.frequency - frequency);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = note;
    }
  }

  return nearest;
}

/**
 * Formatea una nota musical para mostrar
 * @param note Nota musical
 * @returns String formateado (ej: "A4", "C#5")
 */
export function formatNote(note: MusicalNote): string {
  return `${note.name}${note.octave}`;
}

/**
 * Obtiene el rango de frecuencias audibles para humanos
 * @returns { min: 20, max: 20000 }
 */
export function getAudibleRange() {
  return { min: 20, max: 20000 };
}
