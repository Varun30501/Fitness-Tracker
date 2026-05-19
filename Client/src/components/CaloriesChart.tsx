import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { useAppContext } from '../context/AppContext';

const CaloriesChart = () => {

    const { allActivityLogs, allFoodLogs } = useAppContext();

    const getData = () => {
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const dailyFood = allFoodLogs.filter(log => log.createdAt?.split('T')[0] === dateString);
            const dailyActivity = allActivityLogs.filter(log => log.createdAt?.split('T')[0] === dateString);

            const intake = dailyFood.reduce((sum, item) => sum + item.calories, 0);
            const burn = dailyActivity.reduce((sum, item) => sum + (item.calories || 0), 0);

            data.push({
                name: dayName,
                Intake: intake,
                Burn: burn,
                date: dateString
            });
        }
        return data;
    };

    const data = getData();

    return (
        <div className="mt-4 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} className="dark:text-slate-400" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} className="dark:text-slate-400" />
                    <Tooltip cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }} contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.92)', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.22)', boxShadow: '0 18px 45px -22px rgb(15 23 42 / 0.45)', backdropFilter: 'blur(18px)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="Intake" fill="#10b981" radius={[8, 8, 0, 0]} barSize={14} name="Intake" />
                    <Bar dataKey="Burn" fill="#f97316" radius={[8, 8, 0, 0]} barSize={14} name="Burn" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CaloriesChart;
