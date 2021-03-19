import styled from "styled-components";

const Container = styled.div`
  width: 24px;
  height: 24px;
`

const Line = styled.div`
  height: 2px;
  width: 24px;
  background-color: white;

  transition: 0.2s all ease-in;
`

const LineTop = styled(Line)``
const LineBottom = styled(Line)`
  margin-top: 8px;
`

interface MenuButtonProps {
  isOpen: boolean
  onToggle: () => void
}

const MenuButton = ({ isOpen, onToggle }: MenuButtonProps) => {
  const lineTopStyle = {
    transform: isOpen ? 'translateY(10px) rotate(-45deg)' : 'none'
  }
  const lineBottomStyle = {
    transform: isOpen ? 'rotate(45deg)' : 'none'
  }

  return (
    <Container onClick={onToggle}>
      <LineTop style={lineTopStyle} />
      <LineBottom style={lineBottomStyle} />
    </Container>
  )
}

export default MenuButton;