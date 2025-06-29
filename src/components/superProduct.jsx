export default function SuperProduct(props) {
    return (
        <div>
            <h1>Featured this week...</h1>
            <h2>{props.name}</h2>
            <p>{props.price}</p>
            <img src={props.image} alt={props.name} />
        </div>
    );
}
