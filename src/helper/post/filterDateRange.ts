// The  function return an array of object with provided query ,, example [ {$gte : 5 } , {$eq : 2 } ]
export function startEndDateRangeFilter (startEnddateInfo: any) {

    let dateRange: any = {};
    let dateRangeTarget = startEnddateInfo.by === 'updatedAt' ? "updatedAt" : "createdAt";
    if (startEnddateInfo.startDate || startEnddateInfo.endDate) {
        dateRange[dateRangeTarget] = {};
    }
    if (startEnddateInfo.startDate) {
        dateRange[dateRangeTarget]["$gte"] = new Date(startEnddateInfo.startDate);
    }
    if (startEnddateInfo.endDate) {
        dateRange[dateRangeTarget]["$lte"] = new Date(startEnddateInfo.endDate);
    }

    return dateRange;

}
