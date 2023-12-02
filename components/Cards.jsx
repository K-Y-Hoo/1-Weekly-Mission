// import "@/styles/landing.css";
import Card from "./Card";

const Cards = ({ fullData }) => {
  return (
    <div className="cards-area">
      <div>
        <ul className="cards-ul">
          {fullData.map((data) => (
            <Card key={data?.id} data={data} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Cards;
