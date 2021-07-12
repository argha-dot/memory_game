import json, os, csv
from pprint import pprint


def get_file_contents():
    with open(os.path.join(".", "12-7-2021.mod.json"), "r") as f:
        json_str = f.read().replace("\n", "")
        pass

    return json.loads(json_str)


def create_csv_g0(dict_obj):

    session_names = ["g0-training", "g0-authentication", "g0-authentication2"]

    with open("4-7-2021.g0.csv", "w", newline="") as file:
        csv_writer = csv.writer(file)

        csv_writer.writerow(
            [
                "Names",
                "Pass Sequence",
                "Hits-Training",
                "Misses-Training",
                "HitRate-Training",
                "Hits-Auth-1",
                "Misses-Auth-1",
                "HitRate-Auth-1",
                "passHits-Auth-1",
                "passMisses-Auth-1",
                "passHitRate-Auth-1",
                "Hits-Auth-2",
                "Misses-Auth-2",
                "HitRate-Auth-2",
                "passHits-Auth-2",
                "passMisses-Auth-2",
                "passHitRate-Auth-2",
                "User ID",
            ]
        )

        for user in list(dict_obj.items()):
            # user = list(dict_obj.items())[1]
            hits_training = ""
            misses_training = ""
            hitRate_training = ""
            hits_auth_1 = ""
            misses_auth_1 = ""
            hitRate_auth_1 = ""
            passHits_auth_1 = ""
            passMisses_auth_1 = ""
            passHitRate_auth_1 = ""
            hits_auth_2 = ""
            misses_auth_2 = ""
            hitRate_auth_2 = ""
            passHits_auth_2 = ""
            passMisses_auth_2 = ""
            passHitRate_auth_2 = ""

            try:
                for item in list(user[1].items()):
                    if item[0] == "passSequence":
                        passSequence = " ".join(user[1].get("passSequence"))
                    elif item[0] == "user":
                        _user = user[1].get("user")
                    else:
                        if item[1].get("session") == session_names[0]:
                            hits_training = item[1].get("hits")
                            misses_training = item[1].get("misses")
                            hitRate_training = item[1].get("hitRate")
                        elif item[1].get("session") == session_names[1]:
                            hits_auth_1 = item[1].get("hits")
                            misses_auth_1 = item[1].get("misses")
                            hitRate_auth_1 = item[1].get("hitRate")
                            passHits_auth_1 = item[1].get("passHits")
                            passMisses_auth_1 = item[1].get("passMisses")
                            passHitRate_auth_1 = item[1].get("passHitRate")
                        elif item[1].get("session") == session_names[2]:
                            hits_auth_2 = item[1].get("hits")
                            misses_auth_2 = item[1].get("misses")
                            hitRate_auth_2 = item[1].get("hitRate")
                            passHits_auth_2 = item[1].get("passHits")
                            passMisses_auth_2 = item[1].get("passMisses")
                            passHitRate_auth_2 = item[1].get("passHitRate")
                        else:
                            raise Exception()

                csv_writer.writerow(
                    [
                        _user,
                        passSequence,
                        hits_training,
                        misses_training,
                        hitRate_training,
                        hits_auth_1,
                        misses_auth_1,
                        hitRate_auth_1,
                        passHits_auth_1,
                        passMisses_auth_1,
                        passHitRate_auth_1,
                        hits_auth_2,
                        misses_auth_2,
                        hitRate_auth_2,
                        passHits_auth_2,
                        passMisses_auth_2,
                        passHitRate_auth_2,
                        user[0],
                    ]
                )
            except Exception:
                continue


def create_csv_g1(dict_obj):

    session_names = ["g1-training", "g1-authentication", "g1-authentication2"]

    with open("4-7-2021.g1.csv", "w", newline="") as file:
        csv_writer = csv.writer(file)

        csv_writer.writerow(
            [
                "Names",
                "Pass Sequence",
                "Hits-Training",
                "Misses-Training",
                "HitRate-Training",
                "Hits-Auth-1",
                "Misses-Auth-1",
                "HitRate-Auth-1",
                "passHits-Auth-1",
                "passMisses-Auth-1",
                "passHitRate-Auth-1",
                "Hits-Auth-2",
                "Misses-Auth-2",
                "HitRate-Auth-2",
                "passHits-Auth-2",
                "passMisses-Auth-2",
                "passHitRate-Auth-2",
                "User ID",
            ]
        )

        for user in list(dict_obj.items()):
            # user = list(dict_obj.items())[1]
            hits_training = ""
            misses_training = ""
            hitRate_training = ""
            hits_auth_1 = ""
            misses_auth_1 = ""
            hitRate_auth_1 = ""
            passHits_auth_1 = ""
            passMisses_auth_1 = ""
            passHitRate_auth_1 = ""
            hits_auth_2 = ""
            misses_auth_2 = ""
            hitRate_auth_2 = ""
            passHits_auth_2 = ""
            passMisses_auth_2 = ""
            passHitRate_auth_2 = ""

            try:
                for item in list(user[1].items()):
                    if item[0] == "passSequence":
                        passSequence = " ".join(user[1].get("passSequence"))
                    elif item[0] == "user":
                        _user = user[1].get("user")
                    else:
                        if item[1].get("session") == session_names[0]:
                            hits_training = item[1].get("hits")
                            misses_training = item[1].get("misses")
                            hitRate_training = item[1].get("hitRate")
                        elif item[1].get("session") == session_names[1]:
                            hits_auth_1 = item[1].get("hits")
                            misses_auth_1 = item[1].get("misses")
                            hitRate_auth_1 = item[1].get("hitRate")
                            passHits_auth_1 = item[1].get("passHits")
                            passMisses_auth_1 = item[1].get("passMisses")
                            passHitRate_auth_1 = item[1].get("passHitRate")
                        elif item[1].get("session") == session_names[2]:
                            hits_auth_2 = item[1].get("hits")
                            misses_auth_2 = item[1].get("misses")
                            hitRate_auth_2 = item[1].get("hitRate")
                            passHits_auth_2 = item[1].get("passHits")
                            passMisses_auth_2 = item[1].get("passMisses")
                            passHitRate_auth_2 = item[1].get("passHitRate")
                        else:
                            raise Exception()

                csv_writer.writerow(
                    [
                        _user,
                        passSequence,
                        hits_training,
                        misses_training,
                        hitRate_training,
                        hits_auth_1,
                        misses_auth_1,
                        hitRate_auth_1,
                        passHits_auth_1,
                        passMisses_auth_1,
                        passHitRate_auth_1,
                        hits_auth_2,
                        misses_auth_2,
                        hitRate_auth_2,
                        passHits_auth_2,
                        passMisses_auth_2,
                        passHitRate_auth_2,
                        user[0],
                    ]
                )
            except Exception:
                continue


def check_for_missing(dict_obj):
    arr = list(dict_obj.items())

    print("Names missing: ")
    for value in arr:
        if value[1].get("user") == None:
            pprint(value[0])

    print("")


def check_for_duplicate(dict_obj):

    print("Session duplicates: ")
    for obj in list(dict_obj.items()):
        session_names = []

        for item in list(obj[1].items()):
            if item[0] != "passSequence" and item[0] != "user":
                if item[1].get("session") in session_names:
                    pprint(obj[0])
                    continue
                session_names.append(item[1].get("session"))
    print("")


def add_g0_training(dict_obj):

    changed = False

    print("Session ids Missing: ")
    for obj in list(dict_obj.items()):
        for item in list(obj[1].items()):
            if item[0] != "passSequence" and item[0] != "user":
                if item[1].get("session") == None:
                    print(f"{obj[0]} -> {item[0]}")
                    changed = True
                    item[1]["session"] = "g0-training"

    if changed:
        with open("12-7-2021.mod.json", "w") as target:
            json.dump(dict_obj, target, indent=4)


def separate_sessions():
    session_names = [
        "g0-training",
        "g0-authentication",
        "g0-authentication2",
        "g1-authentication",
        "g1-training",
    ]


if __name__ == "__main__":
    obj = get_file_contents()
    check_for_missing(obj)
    check_for_duplicate(obj)
    add_g0_training(obj)
    create_csv_g0(obj)
    create_csv_g1(obj)
