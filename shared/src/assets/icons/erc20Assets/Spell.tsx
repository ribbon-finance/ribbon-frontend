import SpellImage from "../../png/Spell.png";

export const Spell: React.FC = ({ ...props }) => (
  <img src={SpellImage} width="100%" alt="Spell" {...props}></img>
);
