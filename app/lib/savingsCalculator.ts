export interface SavingsTimeline {
  days: number;
  months: number;
  weeks: number;
  averageDailyDeposit: number;
  averageWeeklyDeposit: number;
  averageMonthlyDeposit: number;
  isAchievable: boolean;
  message: string;
}

export interface DepositHistory {
  amount: number;
  date: string;
  goalId: string;
}

export class SavingsCalculator {
  /**
   * Calculate timeline to reach savings goal based on deposit history
   */
  static calculateTimeline(
    targetAmount: number,
    currentAmount: number,
    depositHistory: DepositHistory[],
    goalId: string
  ): SavingsTimeline {
    const remaining = targetAmount - currentAmount;
    
    if (remaining <= 0) {
      return {
        days: 0,
        months: 0,
        weeks: 0,
        averageDailyDeposit: 0,
        averageWeeklyDeposit: 0,
        averageMonthlyDeposit: 0,
        isAchievable: true,
        message: "Goal already achieved! 🎉"
      };
    }

    // Filter deposits for this specific goal
    const goalDeposits = depositHistory.filter(deposit => deposit.goalId === goalId);
    
    if (goalDeposits.length === 0) {
      return {
        days: Infinity,
        months: Infinity,
        weeks: Infinity,
        averageDailyDeposit: 0,
        averageWeeklyDeposit: 0,
        averageMonthlyDeposit: 0,
        isAchievable: false,
        message: "No deposit history yet. Start saving to see timeline! 💰"
      };
    }

    // Calculate time-based averages
    const now = new Date();
    const deposits = goalDeposits.map(deposit => ({
      amount: deposit.amount,
      date: new Date(deposit.date),
      daysAgo: Math.max(1, Math.ceil((now.getTime() - new Date(deposit.date).getTime()) / (1000 * 60 * 60 * 24)))
    }));

    // Calculate different time-based averages
    const totalDeposited = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    const totalDays = Math.max(1, Math.ceil((now.getTime() - Math.min(...deposits.map(d => d.date.getTime()))) / (1000 * 60 * 60 * 24)));
    
    const averageDailyDeposit = totalDeposited / totalDays;
    const averageWeeklyDeposit = averageDailyDeposit * 7;
    const averageMonthlyDeposit = averageDailyDeposit * 30;

    // Calculate timeline based on different scenarios
    const daysToComplete = averageDailyDeposit > 0 ? Math.ceil(remaining / averageDailyDeposit) : Infinity;
    const weeksToComplete = averageWeeklyDeposit > 0 ? Math.ceil(remaining / averageWeeklyDeposit) : Infinity;
    const monthsToComplete = averageMonthlyDeposit > 0 ? Math.ceil(remaining / averageMonthlyDeposit) : Infinity;

    // Determine if achievable (within 5 years)
    const isAchievable = daysToComplete <= 1825; // 5 years

    // Generate message based on timeline
    let message = "";
    if (daysToComplete <= 30) {
      message = `Almost there! ${daysToComplete} days to go! 🚀`;
    } else if (daysToComplete <= 90) {
      message = `Great progress! ${Math.ceil(daysToComplete / 7)} weeks remaining! 📈`;
    } else if (daysToComplete <= 365) {
      message = `On track! ${Math.ceil(daysToComplete / 30)} months to go! 🎯`;
    } else if (daysToComplete <= 1095) {
      message = `Steady progress! ${Math.ceil(daysToComplete / 365)} years to go! 💪`;
    } else {
      message = `Consider increasing your savings rate! 📊`;
    }

    return {
      days: daysToComplete,
      months: Math.ceil(daysToComplete / 30),
      weeks: Math.ceil(daysToComplete / 7),
      averageDailyDeposit,
      averageWeeklyDeposit,
      averageMonthlyDeposit,
      isAchievable,
      message
    };
  }

  /**
   * Get deposit history from localStorage (fallback)
   */
  static getDepositHistory(): DepositHistory[] {
    try {
      const history = localStorage.getItem('depositHistory');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add deposit to history
   */
  static addDepositToHistory(amount: number, goalId: string): void {
    try {
      const history = this.getDepositHistory();
      history.push({
        amount,
        date: new Date().toISOString(),
        goalId
      });
      localStorage.setItem('depositHistory', JSON.stringify(history));
    } catch (error) {
      // Failed to save deposit history
    }
  }

  /**
   * Format timeline for display
   */
  static formatTimeline(timeline: SavingsTimeline): string {
    if (timeline.days === 0) return "Goal achieved! 🎉";
    if (timeline.days === Infinity) return "No timeline available";
    
    if (timeline.days <= 7) {
      return `${timeline.days} day${timeline.days !== 1 ? 's' : ''}`;
    } else if (timeline.days <= 30) {
      return `${timeline.weeks} week${timeline.weeks !== 1 ? 's' : ''}`;
    } else if (timeline.days <= 365) {
      return `${timeline.months} month${timeline.months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.ceil(timeline.days / 365);
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  }
}
