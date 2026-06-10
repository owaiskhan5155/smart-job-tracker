function StatCard({ title, count }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
}

export default StatCard;