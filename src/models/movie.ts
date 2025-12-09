type Person = { name: string };

type Genre = {
  ID: number;
  Name: string;
  NameEN: string;
};

export type Movie = {
  _id: string;
  id: number;
  title: string;
  actors_abridged: Person[];
  alternativeTitles?: string;
  certificateIS: string;
  durationMinutes: number;
  genres: Genre[];
};
