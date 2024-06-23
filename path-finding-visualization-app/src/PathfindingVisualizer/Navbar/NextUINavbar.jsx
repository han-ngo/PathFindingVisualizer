import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { Logo } from "@/components/icons";

export default function NextUINavbar(props) {
  const { onSelect } = props;

  // Handle selected Algorithm
  const [selectedAlgoKeys, setSelectedAlgoKeys] = React.useState(
    new Set(["Select an Algorithm"])
  );
  const selectedAlgoValue = React.useMemo(
    () => Array.from(selectedAlgoKeys).join(", ").replaceAll("_", " "),
    [selectedAlgoKeys]
  );
  const handleAlgoSelectionChange = (keys) => {
    setSelectedAlgoKeys(keys);
    if (onSelect) {
      onSelect(keys.currentKey);
    }
  };

  // Handle selected Maze Pattern
  const [selectedMazeKeys, setSelectedMazeKeys] = React.useState(
    new Set(["Select a Maze Pattern"])
  );
  const selectedMazeValue = React.useMemo(
    () => Array.from(selectedMazeKeys).join(", ").replaceAll("_", " "),
    [selectedMazeKeys]
  );
  const handleMazeSelectionChange = (keys) => {
    setSelectedMazeKeys(keys);
  };

  return (
    <>
      <Navbar maxWidth="2xl" position="sticky">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-4" href="/">
            <Logo />
            <p className="font-bold text-foreground capitalize">
              Path-Finding Visualizer
            </p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
          <NavbarItem>
            <Dropdown classNames="dark text-foreground bg-background">
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="capitalize"
                  style={{ backgroundColor: "transparent" }}
                >
                  {selectedAlgoValue}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select an Algorithm"
                variant="light"
                disallowEmptySelection
                selectionMode="single"
                selectedAlgoKeys={selectedAlgoKeys}
                onSelectionChange={handleAlgoSelectionChange}
              >
                <DropdownItem key="Dijkstra's">Dijkstra's</DropdownItem>
                <DropdownItem key="BFS">Breadth-First Search</DropdownItem>
                <DropdownItem key="DFS">Depth-First Search</DropdownItem>
                <DropdownItem key="A*">A* Search</DropdownItem>
                <DropdownItem key="UCS">Uniform Cost Search</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          <NavbarItem>
            <Dropdown classNames="dark text-foreground bg-background">
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="capitalize"
                  style={{ backgroundColor: "transparent" }}
                >
                  {selectedMazeValue}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select a Maze Pattern"
                variant="light"
                selectionMode="single"
                selectedAlgoKeys={selectedMazeKeys}
                onSelectionChange={handleMazeSelectionChange}
              >
                <DropdownItem key="Recursive_Division">
                  Recursive Division
                </DropdownItem>
                <DropdownItem key="Recursive_Division_Horizontal">
                  Recursive Division (Horizontal Skew)
                </DropdownItem>
                <DropdownItem key="Recursive_Division_Vertical">
                  Recursive Division (Vertical Skew)
                </DropdownItem>
                <DropdownItem key="Random">Random</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-small clear-board"
              color="foreground"
              href="#"
            >
              Clear Board
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-small" color="foreground" href="#">
              Speed
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              className="handle-visualize bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-foreground font-bold"
              as={Link}
              variant="flat"
              href="#"
              auto
            >
              Visualize Algorithm
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}
