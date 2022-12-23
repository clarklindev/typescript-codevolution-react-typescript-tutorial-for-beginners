type ListProps<T> = {
  items: T[]
  onClick: (value: T) => void
}

// T is an object which has id property - specify what T is <T extends { id: number }>
export const List = <T extends { id: number }>({
  items,
  onClick
}: ListProps<T>) => {
  return (
    <div>
      <h2>List of items</h2>
      {items.map(item => {
        return (
          <div key={item.id} onClick={() => onClick(item)}>
            {item.id}
          </div>
        )
      })}
    </div>
  )
}


// jsx way
// type ListProps = {
//   items: string[]
//   onClick:(value:string) => void
// }
//
// export const List = ({items, onClick}:ListProps)=>{
//   return (
//     <div>
//       <h2>List of Items</h2>
//       {items.maps(item, index)=>{
//         return (
//           <div key={index} onClick={()=> onClick(item)}>
//             {item}
//           </div>
//         );
//       }}
//     </div>
//   );
// }
