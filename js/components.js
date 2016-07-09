class ScoreBox extends React.Component {
	render() {

		const purse = player.purse;

		return( 
			<div>
				<h3>Score Box</h3>
				<p className="score">
					Current score: {purse}
				</p>
			</div>
		);
	}
}

class Buttons extends React.Component {
	render(){
		return(
			<div>
			  <button id="hit">Hit</button>
			  <button id="stand">Stand</button>
			  <button id="double">Double</button>
			  <button id="split">Split</button>
			  <button id="drawpush">Draw/Push</button>
			</div>
		)
	}
}


let scorebox = document.getElementById( 'scorebox' );
let buttons = document.getElementById( 'buttons' );


ReactDOM.render(
	<Buttons />, buttons
);

ReactDOM.render(
	<ScoreBox />, scorebox
);