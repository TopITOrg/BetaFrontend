import type {SectionMember} from '@/hooks/useSectionMembers';

interface SectionMemberCardProps {
    member: SectionMember;
}

export const SectionMemberCard: React.FC<SectionMemberCardProps> = ({member}) => {
    return (
        <div
            className="border-2 border-blue-400 rounded-4xl p-6 w-80 shadow-lg transition-all duration-200 hover:shadow-xl bg-white hover:scale-[1.02]">
            {/* Заголовок */}
            <div className="text-center mb-4">
                <h3 className="font-bold text-xl text-gray-800">Участник секции</h3>
                <div
                    className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 text-sm font-medium mt-2">
                    Активный участник
                </div>
            </div>

            {/* Информация об участнике */}
            <div className="space-y-3 mb-4">
                <div>
                    <p className="text-sm text-gray-600">Имя участника</p>
                    <p className="font-semibold text-lg text-gray-800">{member.UserName}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-600">Секция</p>
                    <p className="font-medium text-gray-800">{member.ClubName}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-600">Дата принятия</p>
                    <p className="text-sm text-gray-700">
                        {new Date(member.CreatedAt).toLocaleDateString('ru-RU')}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-600">Статус с</p>
                    <p className="text-sm text-gray-700">
                        {new Date(member.UpdatedAt).toLocaleDateString('ru-RU')}
                    </p>
                </div>
            </div>

            {/* Дополнительная информация */}
            <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">ID участника</p>
                <p className="text-sm font-mono text-gray-700">#{member.UserID}</p>
            </div>
        </div>
    );
};