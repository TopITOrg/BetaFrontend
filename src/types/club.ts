// Если импортируете типы из других файлов, используйте:
// import type { SomeType } from './some-file';

export interface ClubFromAPI {
    ID: number;
    Name: string;
    Description: string;
    SportTypeID: number;
    SportType: string;
    TeacherID: number;
    Teacher: string;
    TotalPlaces: number | null;
    Place: string;
    EducationLevelID: number;
    EducationLevel: string;
    RequiredWorkoutPerWeek: number;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface ClubData {
    id?: number;
    title: string;
    availableSpots: string;
    location: string;
    workoutsPerWeek: string;
    skillLevel: string;
    description: string
}

export const mapApiClubToCardData = (club: ClubFromAPI): ClubData => {
    const mapEducationLevel = (level: string): string => {
        const levelMap: { [key: string]: string } = {
            'начальный': 'начальный',
            'beginner': 'начальный',
            'продвинутый': 'продвинутый',
            'advanced': 'продвинутый',
            'ГСС': 'ГСС',
            'gss': 'ГСС'
        };
        return levelMap[level.toLowerCase()] || level;
    };

    const availableSpots = club.TotalPlaces
        ? `0/${club.TotalPlaces}`
        : '0/0';

    return {
        id: club.ID,
        title: club.Name,
        availableSpots: availableSpots,
        location: club.Place,
        workoutsPerWeek: `${club.RequiredWorkoutPerWeek}`,
        skillLevel: mapEducationLevel(club.EducationLevel),
        description: club.Description
    };
};