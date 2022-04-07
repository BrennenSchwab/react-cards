import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";

const API_URL = "http://deckofcardsapi.com/api/deck";

/* Deck function represents the deck referenced by the api. Users can draw cards from the deck. */

function Deck (){
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);

    /* Get deck from API and set. */

    useEffect(() => {
        async function getDeck(){
            let d = await axios.get(`${API_URL}/new/shuffle/`);
            setDeck(d.data);
        }
        getDeck();
    }, [setDeck]);

    /* Setup for autoDraw. if true, cards will be drawn every second. */

    useEffect(() => {
        async function getCard(){
            let { deck_id } = deck;

            // try: draw next card, if no remaining, throw error for no card, 
            // if cards remaining, draw another card. 
            // Catch for errors.

            try {
                let res = await axios.get(`${API_URL}/${deck_id}/draw/`);

                if (res.data.remaining === 0){
                    setAutoDraw(false);
                    throw new Error ("Error: no cards remaining!");

                }

                const card = res.data.cards[0];

                setDrawn(d => [
                    ...d,{
                        id: card.code,
                        name: card.value + " " + card.suit,
                        image: card.image
                    }
                ]);

            }catch (err){
                alert(err);
            }
        }
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
              await getCard();
            }, 1000);
          }
      
          return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
          };
        }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
      };
    
      const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
      ));
    
      return (
        <div className="Deck">
          {deck ? (
            <button onClick={toggleAutoDraw}>
              {autoDraw ? "Stop" : "Start"} drawing.
            </button>
          ) : null}
          <div>{cards}</div>
        </div>
      );
}
        
export default Deck;