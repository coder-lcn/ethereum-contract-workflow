import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, calc(100% / 2 - calc(60px * (2 - 1) / 2)));
  grid-gap: 60px;
  box-sizing: border-box;
  padding: 60px 0;
`;

export const Content = styled.div`
  display: flex;

  > div:first-child {
    flex: 1;
  }

  > div:last-child {
    width: 120px;
  }
`;

export const DataContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(100% / 2 - calc(10px * (2 - 1) / 2)));
  grid-gap: 10px;
`;

export const DataItem = styled.div`
  margin-bottom: 20px;

  p {
    line-height: 1;
    margin: 0;
  }

  p:first-child {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
`;

export const ProcessText = styled.div`
  display: inline-block;
  margin: 0;
  line-height: 1;
  font-size: 18px;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #108ee9, #87d068);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;
