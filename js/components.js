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

let scorebox = document.getElementById( 'scorebox' );

ReactDOM.render(
	<ScoreBox />, scorebox
);