const Loader = () => {
    return (
        <section className="loader">
            <div></div>
        </section>
    )
}

export default Loader;

export const Skeleton = ({ width = "unset", length = 3 }: { width?: string, length?: number }) => {
    const skeleton = Array.from({
        length
    }, (_, idx) => <div key={idx} className="skeleton-shape"></div>);

    return <div className="skeleton-loader" style={{ width }}>
        {skeleton}
    </div>
}