import React from 'react'
import store from '../../app/store'
import {
  increment, 
  decrement, 
  incrementByAmount,
  decrementByAmount
} from './counterSlice'
import reducer from './counterSlice'

// export function Counter() {
//   const count = useSelector(state => state.counter.value)
//   const dispatch = useDispatch()

//   return (
//     <div>
//       <div>
//         <button
//           aria-label="Increment value"
//           onClick={() => dispatch(increment())}
//         >
//           Increment
//         </button>
//         <span>{count}</span>
//         <button
//           aria-label="Decrement value"
//           onClick={() => dispatch(decrement())}
//         >
//           Decrement
//         </button>
//       </div>
//     </div>
//   )
// }

export default class Counter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      num: 0
    }
  }

  render() {
    let count = store.getState().counter.value;
    console.log();
      return (
        <div>
          <div>
            <button
              aria-label="Increment value"
              onClick={() => store.dispatch(increment())}
            >
              Increment
            </button>
            <span>&nbsp;{count}&nbsp;</span>
            <button
              aria-label="Decrement value"
              onClick={() => store.dispatch(decrement())}
            >
              Decrement
            </button>
          </div>
          <div>
            <button
              aria-label="Increment any value"
              onClick={() => store.dispatch(incrementByAmount(this.state.num))}
            >
              Increment any value
            </button>
            <input value={this.state.num} onChange={(e) => {
              console.log(e)
              this.setState({
                num: e.target.value
              })
            }} />
            <button
              aria-label="Decrement any value"
              onClick={() => store.dispatch(decrementByAmount(this.state.num))}
            >
              Decrement any value
            </button>
          </div>
        </div>
      )
  }
}