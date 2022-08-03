export const checkNames = (w1, w2, w3, a1, a2, a3, t, data) => {
    console.log("checking...")
    console.log(data.members)
    let result = {}
    result.valid = true
    let invalid = []
    let names = [w1, w2, w3, a1, a2, a3, t];
    let other_members = []
    let invalid_str = ""
    if (w1.length > 0 && !data.members.includes(w1)) {
        invalid.push("Witness1: " + w1)
        result.valid = false
    }
    if (w2.length > 0 && !data.members.includes(w2)) {
        invalid.push("Witness2: " + w2)
        result.valid = false
    }
    if (w3.length > 0 && !data.members.includes(w3)) {
        invalid.push("Witness1: " + w3)
        result.valid = false
    }
    if (a1.length > 0 && !data.members.includes(a1)) {
        invalid.push("Attorney1: " + w1)
        result.valid = false
    }
    if (a2.length > 0 && !data.members.includes(a2)) {
        invalid.push("Attorney2: " + a2)
        result.valid = false
    }
    if (a3.length > 0 && !data.members.includes(a3)) {
        invalid.push("Attorney3: " + a3)
        result.valid = false
    }
    if (t.length > 0 && !data.members.includes(t)) {
        invalid.push("TimeKeeper: " + t)
        result.valid = false
    }
    console.log(names)
    if (result.valid) {
        var arrayLength = data.members.length;
        for (var i = 0; i < arrayLength; i++) {
            console.log(data.members[i])
            if (!names.includes(data.members[i])) {
                other_members.push(data.members[i]);
            }
        }
    } else {
        invalid_str += "Invalid names: ["
        invalid.forEach(function(e, i) {invalid_str += e + ";"})
        invalid_str += "]"
    }
    result.other_members = other_members;
    result.invalid_str = invalid_str
    return result
}

export const get_defense_other_members = (data) => {
    let names = [data.DefenseWitness1, data.DefenseWitness2, data.DefenseWitness3, data.DefenseAttorney1,
                 data.DefenseAttorney2, data.DefenseAttorney3, data.TimeKeeper];
    let other_members = [];
    var arrayLength = data.members.length;
    for (var i = 0; i < arrayLength; i++) {
        if (!names.includes(data.members[i])) {
            other_members.push(data.members[i]);
        }
    }
    return other_members;
}

export const get_plaintiff_other_members = (data) => {
    let names = [data.PlaintiffWitness1, data.PlaintiffWitness2, data.PlaintiffWitness3, data.PlaintiffAttorney1,
                 data.PlaintiffAttorney2, data.PlaintiffAttorney3, data.TimeKeeper];
    let other_members = [];
    var arrayLength = data.members.length;
    for (var i = 0; i < arrayLength; i++) {
        if (!names.includes(data.members[i])) {
            other_members.push(data.members[i]);
        }
    }
    return other_members;
}
