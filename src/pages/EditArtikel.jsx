import { useParams } from "react-router-dom";
import ArtikelForm from "../pages/ArtikelForm";

export default function EditArtikel() {
  const { id } = useParams();
  return <ArtikelForm mode="edit" artikelId={id} />;
}