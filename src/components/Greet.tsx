type GreetProps = {
  name: string,
  messageCount: number,
  isLoggedIn: boolean
}

export const Greet = (props:GreetProps) => {
  return ( <div>
    {props.name}{props.messageCount}{props.isLoggedIn}
  </div> );
}
 