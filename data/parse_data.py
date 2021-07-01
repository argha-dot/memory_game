import json, os, pprint, csv

def get_file_contents():
    with open(os.path.join(".", "1-7-2021.json"), "r") as f:
        json_str = f.read().replace("\n", "");
        pass
    

    return json.loads(json_str)


def check_for_missing(dict_obj):
    arr = list(dict_obj.values())

    for value in arr:
        if value.get("user") ==  None:
            pprint.pprint(value)


if __name__ == "__main__":
    obj = get_file_contents()
    check_for_missing(obj)
