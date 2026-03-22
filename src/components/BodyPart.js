import React from 'react';
import { Stack, Typography } from '@mui/material';
import gymIcon from '../assets/icons/gym.png';
import allIcon from '../assets/icons/all.png';
import backIcon from '../assets/icons/back.png';
import cardioIcon from '../assets/icons/cardio.png';
import chestIcon from '../assets/icons/chest.png';
import lowerArmsIcon from '../assets/icons/lowerArms.png';
import lowerLegsIcon from '../assets/icons/lowerLegs.png';
import neckIcon from '../assets/icons/neck.png';
import shouldersIcon from '../assets/icons/shoulder.png';
import upperArmsIcon from '../assets/icons/upperArms.png';
import upperLegsIcon from '../assets/icons/upperLegs.png';
import waistIcon from '../assets/icons/waist.png';


const icons = {
  all: allIcon,
  back: backIcon,
  cardio: cardioIcon,
  chest: chestIcon, 
  'lower arms': lowerArmsIcon,
  'lower legs': lowerLegsIcon,
  neck: neckIcon,
  shoulders: shouldersIcon, 
  'upper arms': upperArmsIcon,
  'upper legs': upperLegsIcon,
  waist: waistIcon,
}

const BodyPart = ({ item, setBodyPart, bodyPart }) => (
  <Stack
    type="button"
    alignItems="center"
    justifyContent="center"
    className="bodyPart-card"
    sx={bodyPart === item ? { 
      borderTop: '7px solid #4A8FE7', 
      background: '#d9d9d9', 
      borderRadius: '20px', 
      width: '8rem', 
      height: '8rem', 
      cursor: 'pointer', 
      gap: '47px' } : { 
        background: '#d9d9d9', 
        borderRadius: '20px', 
        width: '8rem', 
        height: '8rem', 
        cursor: 'pointer', 
        gap: '47px' }}
    onClick={() => {
      setBodyPart(item);
      console.log('item = ', item);
      window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });
    }}
  >
    <img 
      src={icons[item] || gymIcon} 
      alt={item} 
      style={{ 
        width: '60px',
        height: '60px',
        marginBottom: '-2.5rem'
      }} 
    />
    <Typography 
      fontSize="1rem" 
      fontWeight="600" 
      fontFamily="IBM Plex Sans" 
      color="#000" 
      textTransform="capitalize"
    > {item}</Typography>
  </Stack>
);

export default BodyPart;