# React/Typescript

Codevolution - https://www.youtube.com/playlist?list=PLC3y8-rFHvwi1AXijGTKM0BKtHzVC-LSK

## install

```
npx create-react-app my-app --template typescript
```

## src/index.tsx

entry point to react app where we mount app component onto root dom node

## src/App.tsx

containts app component (root component)

## when to use type vs interface

- suggestion use type for applications, interface for libraries

## first component

```tsx
// src/components/Greet.tsx

// create type for props
type GreetProps = {
  name: string;
  surname?: string; //optional
};

export const Greet = (props: GreetProps) => {
  return <div>{props.name}</div>;
};
```

```tsx
// src/App.tsx
import "./App.css";
import { Greet } from "./components/Greet";

function App() {
  return (
    <div className="App">
      <Greet name="Clark" />
    </div>
  );
}

export default App;
```

## Typescript types

- JSX.Element
- React.ReactNode - type for passing react components as children
- handleClick:(event:React.MouseEvent<HTMLButtonElement>)=>void
- handleChange:(event:React.ChangeEvent<HTMLInputElement>)=>void
- styles: React.CSSProperties
- ThemeContextProviderProps

## Typescript errors

- fix by creating type in component with 'children' prop type

```error
Type '{children: string;}' has no properties in common with type 'IntrinsicAttributes'
```

```tsx
type HeadingProps = {
  children: string;
};

export const Heading = (props: HeadingProps) => {
  return <h2>{props.children}</h2>;
};
```

## passing styles as props

```tsx
// container.tsx
type ContainerProps = {
  styles: React.CSSProperties;
};

export const Container = (props: ContainerProps) => {
  return <div style={props.styles}>text goes here</div>;
};
```

```tsx
// App.tsx
import { Container } from "./components/Container";
function App() {
  return (
    <div className="App">
      <Container styles={{ border: "1px solid black", padding: "1rem" }} />
    </div>
  );
}
```

## make types into its own file

```ts
// Person.types.ts

export type Name = {
  first: string;
  last: string;
};

export type PersonType = {
  name: Name;
};
```

```tsx
// Person.tsx
import { PersonType } from "./Person.types";
```

---

## useState Hook

uses type inference

## useState hook when value is know at future point

- const [user, setUser] = useState<AuthUser | null>(null);

## optional chaining operator? - to check if 'user' property exists, then check its 'name' property: <div>{user?.name}</div>

```tsx
type AuthUser = {
  name: string;
  email: string;
};

// const [user, setUser] = useState(null);   //causes typescript error later.. because inferance makes value null, but setUser sets value to {} of type AuthUser type

const [user, setUser] = useState<AuthUser | null>(null);
const handleLogin = () => {
  setUser({
    name: "abc",
    email: "abc@gmail.com",
  });
};

const handleLogout = () => {
  setUser(null);
};

return (
  <div>
    <button onClick={handleLogin}>Login</button>
    <button onClick={handleLogout}>Logout</button>

    <div>{user?.name}</div>
    <div>{user?.email}</div>
  </div>
);
```

## type assertion

- using example above, you can use type assertion if we are certain there wont be other values

```js
const [user, setUser] = useState<AuthUser>({} as AutUser);
```

---

## useReducer hook type

- typing the useReducer hook
- what are we typing? reducer(state, action) becomes reducer(state:CounterState, action:CounterAction)
- state we get type from initialState which is an object
- we get CounterAction type from the dispatch
- here dispatch type is :React.Dispatch<CounterAction>

```tsx
// Counter.tsx
import { useReducer } from "react";

// type CounterState
// type CounterState = {
//   count: number;
// };

// //action type
// type CounterAction = {
//   type: string;
//   payload: number;
// };

//action type
type UpdateActions = {
  type: "increment" | "decrement";
  payload: number;
};

type ResetActions = {
  type: "reset";
};

//discriminated unions
type CounterAction = {
  type: UpdateActions | ResetActions;
};

const initialState = { count: 0 };

function reducer(state: CounterState, action: CounterAction) {
  switch (action.type) {
    case "increment":
      return { count: state.count + action.payload };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

export const Counter = () => {
  const [state, dispatch] = useReducer(reducer, intialState);

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "increment", payload: 10 })}>
        increment 10
      </button>
      // note there is not action type
      <button onClick={() => dispatch({ type: "reset" })} />
    </>
  );
};
```

## action type

- setting type other than 'string' by using template literals

```tsx
//action type
type CounterAction = {
  type: "increment" | "decrement";
  payload: number;
};
```

- set payload as "payload?" to make it optional

## discriminated unions

- using code snipet above, we do not add payload to the dispatch
- add a 'reset' type
- now we create a new type to handle ONLY 'increment' and 'decrement'
- create another type to handle 'reset'
- this is called discriminated unions in typescript - recommended approach for reducer functions

```tsx
//action type
type UpdateActions = {
  type: "increment" | "decrement";
  payload: number;
};

type ResetActions = {
  type: "reset";
  payload;
};

//discriminated unions
type CounterAction = {
  type: UpdateActions | ResetActions;
};
```

## typescript and useContext (typing the contextAPI)

- theme example
- createa a type of ThemeContextProviderProps
- uses inference

```ts
//components/context/theme.ts
export const theme = {
  primary: {
    main: "#35F333",
    text: "#FFF",
  },
  secondary: {
    main: "#434444",
    text: "#000",
  },
};
```

```ts
//components/context/ThemeContext.tsx
import { createContext } from "react";
import { theme } from "./theme";

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

const ThemeContext = createContext(theme);

export const ThemeContextProvider = ({
  children: ThemeContextProviderProps,
}) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
```

```tsx
// App.tsx
import { ThemeContextProvider } from "./components/context/ThemeContext";
import { Box } from "./components/context/Box";
import "./App.css";
function App() {
  return (
    <div className="App">
      <ThemeContextProvider>
        <Box />
      </ThemeContextProvider>
    </div>
  );
}

export default App;
```

```tsx
// components/context/Box.tsx
import { useContext } from "react";

import { ThemeContext } from "./ThemeContext";

export const Box = () => {
  const theme = useContext(ThemeContext);
  return <div style={{ background: theme.primary.main }}>Theme Context</div>;
};
```

## useContext future value

```tsx
<!-- //User.tsx -->
import { useContext } from 'react'
import { UserContext } from './UserContext'

export const User = () => {
  const userContext = useContext(UserContext)
  const handleLogin = () => {
    // if (userContext) {
    userContext.setUser({
      name: 'Vishwas',
      email: 'asd@asd.com'
    })
    // }
  }
  const handleLogout = () => {
    // if (userContext) {
    userContext.setUser(null)
    // }
  }
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      <div>User name is {userContext.user?.name}</div>
      <div>User email is {userContext.user?.email}</div>
      {/* <div>User name is {userContext?.user?.name}</div>
      <div>User email is {userContext?.user?.email}</div> */}
    </div>
  )
}

```

```tsx
// UserContext.tsx
import React, { useState, createContext } from "react"; //step1

type AuthUser = {
  name: string;
  email: string;
};

type UserContextType = {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
};

type UserContextProviderProps = {
  children: React.ReactNode;
};

// export const UserContext = createContext<UserContextType | null>(null)
export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

```jsx
// App.jsx
import { UserContextProvider } from "./components/context/UserContext";
import { User } from "./components/context/User";
import './App.css';

...
function App(){
return (
  <UserContextProvider>
  <User />
</UserContextProvider>

)
}

```

## useRef Hook typing

2 scenario types:

- read only ref for a dom element
- as mutable value which can behave like an instance variable

```tsx
// DomRef.tsx
import { useRef, useEffect } from "react";

export const DomRef = () => {
  const inputRef = useRef<HTMLInputElement>(null!); //null! means non-null

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <input type="text" ref={inputRef} />
    </div>
  );
};
```

## managing mutable refs

-set useRef type to number or null useRef<number | null>(null);

```tsx
import { useState, useRef, useEffect } from "react";

export const MutableRef = () => {
  const [timer, setTimer] = useState(0);
  const interValRef = useRef<number | null>(null); ///set

  const stopTimer = () => {
    if (interValRef.current) {
      window.clearInterval(interValRef.current);
    }
  };
  useEffect(() => {
    interValRef.current = window.setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
    return () => {
      stopTimer();
    };
  }, []);

  return (
    <div>
      HookTimer - {timer} -
      <button onClick={() => stopTimer()}>Stop Timer</button>
    </div>
  );
};
```

## typing class components

- Component<CounterProps, CounterState>

```tsx
import { Component } from "react";

type CounterProps = {
  message: string;
};
type CounterState = {
  count: number;
};

/** The count value is 5 */
export class Counter extends Component<CounterProps, CounterState> {
  state = {
    count: 0,
  };

  handleClick = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Increment</button>
        {this.props.message} {this.state.count}
      </div>
    );
  }
}
```

## Component Prop

-Auth folder

```tsx
// Login.tsx
export const Login = () => {
  return <div>Please login to continue</div>;
};
```

```tsx
// profile.tsx
export type ProfileProps = {
  name: string;
};

export const Profile = ({ name }: ProfileProps) => {
  return <div>Private Profile component. Name is {name}</div>;
};
```

```tsx
// private.tsx
import { Login } from "./Login";
import { ProfileProps } from "./Profile";

type PrivateProps = {
  isLoggedIn: boolean;
  component: React.ComponentType<ProfileProps>;
};

export const Private = ({ isLoggedIn, component: Component }: PrivateProps) => {
  if (isLoggedIn) {
    return <Component name="Vishwas" />;
  } else {
    return <Login />;
  }
};
```

```tsx
// App.tsx
import { Private } from "./components/auth/Private";
import { Profile } from "./components/auth/Profile";

function App() {
  return (
    <div className="App">
      <Private isLoggedIn={true} component={Profile} />
    </div>
  );
}
export default App;
```

## generics

```tsx
type ListProps<T> = {
  items: T[];
  onClick: (value: T) => void;
};

export const List = <T extends { id: number }>({
  items,
  onClick,
}: ListProps<T>) => {
  return (
    <div>
      <h2>List of items</h2>
      {items.map((item) => {
        return (
          <div key={item.id} onClick={() => onClick(item)}>
            {item.id}
          </div>
        );
      })}
    </div>
  );
};
```

## restricting props

- use never type

## tempalte literals & exclude

- specifying what values a prop can be
- exclude combinations with Exclude< , 'options-to-exclude'> eg. "center-center"
- use union type to include eg. "center"

```tsx
type HorizontalPosition = "left" | "center" | "right";
type VerticalPosition = "top" | "center" | "bottom";

type ToastProps = {
  position:
    | Exclude<`${HorizontalPosition}-${VerticalPosition}`, "center-center">
    | "center";
};

/**
 * Position prop can be one of
 * "left-center" | "left-top" | "left-bottom" | "center" | "center-top" |
 * "center-bottom" | "right-center" | "right-top" | "right-bottom"
 */

export const Toast = ({ position }: ToastProps) => {
  return <div>Toast Notification Position - {position}</div>;
};
```

## Wrapping Html elements

- ability to receive special props when building own components
- specifying props type & normal react props <React.ComponentProps<"button"> & children

```jsx
type ButtonProps = {
  variant: "primary" | "secondary",
  children: string,
} & Omit<React.ComponentProps<"button">, "children">;
```

```tsx
// Input.tsx
type InputProps = React.ComponentProps<"input">;

export const Input = (props: InputProps) => {
  return <input {...props} />;
};
```

```tsx
// Button.tsx
type ButtonProps = {
  variant: "primary" | "secondary";
  children: string;
} & Omit<React.ComponentProps<"button">, "children">;

export const CustomButton = ({ variant, children, ...rest }: ButtonProps) => {
  return (
    <button className={`class-with-${variant}`} {...rest}>
      {children}
    </button>
  );
};
```

## Extracting a components prop types

```tsx
//CustomComponent.tsx
import React from "react";
import { Greet } from "../props/Greet";

export const CustomComponent = (props: React.ComponentProps<typeof Greet>) => {
  return <div>{props.name}</div>;
};
```
