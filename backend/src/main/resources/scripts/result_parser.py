import sys
import json
import re
import pdfplumber

def extract_data(pdf_path):
    results = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if not text: continue

                # 1. Find PRN (Your Regex)
                # Matches "PRN No.-12320000"
                prn_match = re.search(r"PRN No\.-(\d+)", text)

                if prn_match:
                    prn = prn_match.group(1)

                    # 2. Find SGPA (Your Regex)
                    # Matches "SGPA:9.5"
                    sgpa_matches = re.findall(r"SGPA:(\d+\.\d+)", text)

                    # 3. Find Status (Your Regex)
                    status_matches = re.findall(r"Status:\s*(\w+)", text)

                    # Simple Logic: Take the last SGPA found on page (Total) or first
                    final_sgpa = float(sgpa_matches[-1]) if sgpa_matches else 0.0
                    final_status = status_matches[-1] if status_matches else "UNKNOWN"

                    student_record = {
                        "prn": prn,
                        "sgpa": final_sgpa,
                        "status": final_status
                    }
                    results.append(student_record)

        # SUCCESS: Print JSON to Stdout
        print(json.dumps(results))

    except Exception as e:
        # FAILURE: Print JSON Error
        error_response = {"error": str(e)}
        print(json.dumps([error_response]))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([{"error": "No file provided"}]))
    else:
        extract_data(sys.argv[1])