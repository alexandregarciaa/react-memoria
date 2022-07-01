import { useEffect, useState } from 'react';
import * as C from './App.syles';

import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { GridItem } from './components/GridItem'; 

import { GridItemType } from './types/GridItemType';
import { items } from './Data/items';
import { time } from 'console';
import { formatTimeElapsed } from '../src/helpers/formtTimeElapsed';


const App = ()=> {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShownCount] = useState<number>(0);
  const [gridItens, setGridItens] = useState<GridItemType[]>([]);


  useEffect(()=> resetAndCreateGrid(), []);

  useEffect(()=>{
      const timer = setInterval(()=> {
        if(playing)setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  },[playing, timeElapsed])

  // verify if opened are equal
  useEffect(() => {
    if(showCount === 2) {
      let opened = gridItens.filter(item => item.shown === true);
      if(opened.length === 2 ) {

        if(opened[0].item === opened[1].item) {       
          //v1 - if both are equal, make every "shown" permanent
          let tmpGrid = [...gridItens];
          for (let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItens(tmpGrid);
          setShownCount(0);
        } else {
          //v2 if they are NOT equal. close all "shown"
          setTimeout(() => {
            let tmpGrid = [...gridItens];
            for (let i in tmpGrid) {
              tmpGrid[i].shown= false;
            }
            setGridItens(tmpGrid);
            setShownCount(0); 
          }, 1000);
        }
            setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [showCount, gridItens]);

  // verify if game is over
  useEffect(()=> {
    if (moveCount > 0 && gridItens.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }
  },[moveCount,gridItens])

  const resetAndCreateGrid = () => {
    //passo 1 - resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    //2 - criar o grid
    //2.1 criar um grid vazio

    let tmpGrid: GridItemType[]=[];
    for(let i = 0; i < (items.length * 2); i++) tmpGrid.push({
        item:null,shown:false, permanentShown: false
    });
    //2.2 - preencher o grid
    for (let w=0; w < 2; w++) {
      for (let i=0; i < items.length; i++) {
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length *2));
        }

        tmpGrid[pos].item= i;
      }
    }
    //2.3 - Jogar no state
    setGridItens(tmpGrid);

    //3 - começar o jogo
    setPlaying(true);

  }

  const handleItemClick = (index:number) => {
    if(playing && index !== null && showCount < 2) {
      let tmpGrid = [...gridItens];
      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShownCount(showCount + 1);
      }  
      setGridItens(tmpGrid);
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt=""/>
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>

        <Button label="Reiniciar" icon={ RestartIcon } onClick={resetAndCreateGrid} />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItens.map((item, index)=> (
            <GridItem 
              key={index}
              item={item}
              onClick={()=> handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
      
    </C.Container>
  );
}

export default App;