import React from 'react'
import styled from 'styled-components';

export const VaultIcon = ({ loading }) => {

  return (
    <VaultDoorInner loading={loading}>
      {/* <VaultDoorLockShadow /> */}
      <VaultDoorLockWrapper>
        < VaultDoorCircle />
        <VaultDoorPistons>
          <Piston number={1} />
          <Piston number={2} />
          <Piston number={3} />
          <piston number={4} />
        </VaultDoorPistons>
      </VaultDoorLockWrapper>
      {/* <VaultDoorHandleShadow /> */}
      {/* <VaultDoorHandleLongShadow /> */}
      <VaultDoorHandle>
        <HandleBar number={1} />
        <HandleBar number={2} />
      </VaultDoorHandle>
    </VaultDoorInner>
  )
}

const VaultDoorLockWrapper = styled.div`
  position: absolute;
  width: 190px;
  height: 190px;
`;

const VaultDoorLock = styled.div`
  background: rgb(185,185,185);
`;

const VaultDoorCircle = styled(VaultDoorLock)`
  position: absolute;
  width: 310px;
  height: 310px;
  margin: 40px;
  border-radius: 50%;
`;

const VaultDoorPistons = styled(VaultDoorLock)`
  position: absolute;
  width: 340px;
  height: 340px;
  margin: 180px 25px;
  background: none;
`;

const Piston = styled.div`
    position: absolute;
    background: rgb(185,185,185);
    width: 340px;
    height: 30px;
    border-radius: 8px;
    transition: all .05s ease-out;

    transform:  ${p => p.number === 2 ? 'rotate(45deg)' : p.number === 3 ? 'rotate(90deg)' : p.number === 4 ? 'rotate(135deg)' : 'rotate(0deg)'};
`;

const HandleBar = styled.div`
  position:  absolute;
  background:  rgb(214, 214, 214);
  height:  22px;
  width:  140px;
  margin:  59px 0;
  transform:  ${p => p.number === 1 ? 'rotate(45deg)' : p.number === 2 ? 'rotate(135deg)' : 'rotate(0deg)'};
`;

const VaultDoorHandle = styled.div`
  position: absolute;
  border: solid 23px rgb(214,214,214);
  width: 140px;
  height: 140px;
  margin: 102px;
  border-radius: 50%;
  transition: all .3s ease-in-out;
`;

// const VaultDoorOuter = styled.div`
//   position: relative;
//   width: 500px;
//   height: 500px;
//   background: rgb(235,235,235);
// `;

const VaultDoorInner = styled.div`
  position: relative;
  // margin: 52px;
  width: 390px;
  height: 390px;
  background: rgb(219,219,219);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  ${VaultDoorHandle} {
    transform: ${p => p.loading && 'rotate(-180deg)'};
    transition: ${p => p.loading && 'all .7s ease-in-out'};
  }

  ${Piston} {
    width: ${p => p.loading && '310px'};
    margin-left: ${p => p.loading && '15px'};
    margin-right: ${p => p.loading && '15px'};
    transition: ${p => p.loading && 'all .2s ease-out'};
  }
`;